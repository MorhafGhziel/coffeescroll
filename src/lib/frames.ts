/**
 * Progressive frame loader for the scroll-scrubbed film.
 *
 * The film is a numbered image sequence. Showing the page never waits for all of it:
 *  1. the first frame (the hero) loads alone and gates the reveal,
 *  2. the rest arrive coarse-to-fine (every 16th frame, then 8th, 4th, 2nd, all) so any scroll position has a
 *     nearby frame early,
 *  3. frames around the current scroll position always jump the queue.
 * Until the exact frame exists, the nearest loaded frame is drawn instead.
 */
export type FrameSet = {
  count: number;
  width: number;
  height: number;
  url: (i: number) => string;
};

export class FrameStore {
  readonly images: (ImageBitmap | HTMLImageElement | null)[];
  private queued = new Set<number>();
  private order: number[] = [];
  private cursor = 0;
  private active = 0;
  private wanted = 0;
  private destroyed = false;

  constructor(
    readonly set: FrameSet,
    private readonly onLoad: (i: number) => void,
    private readonly concurrency = 6,
  ) {
    this.images = new Array(set.count).fill(null);
    const seen = new Set<number>();
    for (let stride = 16; stride >= 1; stride /= 2) {
      for (let i = 0; i < set.count; i += stride) {
        if (!seen.has(i)) {
          seen.add(i);
          this.order.push(i);
        }
      }
    }
    if (!seen.has(set.count - 1)) this.order.splice(1, 0, set.count - 1);
  }

  /** Load a single frame and resolve when it is decoded. */
  async loadOne(i: number) {
    await this.fetch(i);
  }

  /** Begin background loading. */
  start() {
    this.pump();
  }

  /** Tell the store where the viewer is so nearby frames are fetched first. */
  focus(i: number) {
    this.wanted = i;
    this.pump();
  }

  /** Nearest loaded frame to i (searching outward), or null when nothing has loaded yet. */
  nearest(i: number) {
    const n = this.images.length;
    if (this.images[i]) return this.images[i];
    for (let d = 1; d < n; d++) {
      const a = this.images[i - d];
      if (a) return a;
      const b = this.images[i + d];
      if (b) return b;
    }
    return null;
  }

  destroy() {
    this.destroyed = true;
  }

  private next(): number | null {
    // a window around the viewer first
    for (let d = 0; d <= 12; d++) {
      for (const j of [this.wanted + d, this.wanted - d]) {
        if (j >= 0 && j < this.set.count && !this.images[j] && !this.queued.has(j)) return j;
      }
    }
    while (this.cursor < this.order.length) {
      const j = this.order[this.cursor++];
      if (!this.images[j] && !this.queued.has(j)) return j;
    }
    return null;
  }

  private pump() {
    while (!this.destroyed && this.active < this.concurrency) {
      const j = this.next();
      if (j === null) return;
      this.active++;
      this.fetch(j).finally(() => {
        this.active--;
        this.pump();
      });
    }
  }

  private async fetch(i: number) {
    if (this.images[i] || this.queued.has(i)) return;
    this.queued.add(i);
    try {
      const img = new Image();
      img.decoding = "async";
      img.src = this.set.url(i);
      await img.decode();
      if (this.destroyed) return;
      this.images[i] = img;
      this.onLoad(i);
    } catch {
      // leave the slot empty; the nearest loaded frame covers for it and a later focus() retries
    } finally {
      this.queued.delete(i);
    }
  }
}
