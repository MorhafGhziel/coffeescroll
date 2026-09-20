// Screenshots of the scroll story at chosen timeline beats. usage: node scripts/shots.mjs <outDir> <width> <height> <beats,...>
import { createRequire } from "node:module";
const puppeteer = createRequire("D:/coding/motion-video/package.json")("puppeteer-core");
import fs from "node:fs";
const [out, w, h, beatsArg] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const exe = "D:/coding/motion-video/node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe";
const browser = await puppeteer.launch({ executablePath: exe, args: ["--use-angle=d3d11", "--enable-gpu"] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto("http://localhost:3107", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 6000));
for (const b of beatsArg.split(",")) {
  const y = b === "final" ? 1e7 : Math.round((+b / 14.4) * 14.4 * 0.85 * +h);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await new Promise((r) => setTimeout(r, 3200));
  await page.screenshot({ path: `${out}/beat-${b}.jpg`, type: "jpeg", quality: 80 });
  console.log("shot", b, y);
}
console.log("errors:", JSON.stringify(errors.slice(0, 10)));
await browser.close();
