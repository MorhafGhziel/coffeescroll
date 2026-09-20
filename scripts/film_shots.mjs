// Screenshots of the scroll-scrubbed film at fractions of the film section. usage: node scripts/film_shots.mjs <outDir> <w> <h> <p,p,...>
import { createRequire } from "node:module";
import fs from "node:fs";
const puppeteer = createRequire("D:/coding/motion-video/package.json")("puppeteer-core");
const [out, w, h, ps] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const exe = "D:/coding/motion-video/node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe";
const browser = await puppeteer.launch({ executablePath: exe, args: ["--use-angle=d3d11", "--enable-gpu"] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto("http://localhost:3107", { waitUntil: "networkidle0", timeout: 90000 });
await new Promise((r) => setTimeout(r, 5000));
for (const p of ps.split(",")) {
  await page.evaluate((p) => {
    const f = document.querySelector(".film");
    const y = p === "end" ? document.body.scrollHeight : f.offsetTop + (f.offsetHeight - innerHeight) * +p;
    window.scrollTo(0, y);
  }, p);
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: `${out}/p-${p}.jpg`, type: "jpeg", quality: 82 });
}
console.log("errors:", JSON.stringify(errors.slice(0, 10)));
await browser.close();
