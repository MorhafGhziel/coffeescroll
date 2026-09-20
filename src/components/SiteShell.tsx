import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

/** Frame for every page except the home film: fixed nav, the page, the footer. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main className="page">{children}</main>
      <Footer />
    </>
  );
}

/** Page opening: a small label, a large title, one lead paragraph, and optionally a still that fades into the dark. */
export function PageHead({ n, label, title, lead, image, alt }: { n: string; label: string; title: ReactNode; lead: string; image?: string; alt?: string }) {
  return (
    <header className={`phead${image ? " has-image" : ""}`}>
      {image && (
        <div className="phead-img" aria-hidden={alt ? undefined : true}>
          <img src={image} alt={alt ?? ""} width={1600} height={900} />
        </div>
      )}
      <div className="phead-copy">
        <p className="label">
          <span className="num">{n}</span> — {label}
        </p>
        <h1 className="display">{title}</h1>
        <p className="lead">{lead}</p>
      </div>
    </header>
  );
}
