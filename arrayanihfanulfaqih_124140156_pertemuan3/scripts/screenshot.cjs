const puppeteer = require("puppeteer-core");

(async () => {
  const base = "http://localhost:5173";
  const shots = [
    { url: `${base}/`, file: "screenshots/1-dashboard-utama.png" },
    { url: `${base}/stats`, file: "screenshots/2-statistik.png" },
  ];

  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--window-size=1200,800", "--no-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  for (const { url, file } of shots) {
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.screenshot({ path: file, fullPage: true });
    console.log("OK:", file);
  }

  await browser.close();
  console.log("Semua screenshot selesai.");
})().catch((err) => {
  console.error("GAGAL:", err.message);
  process.exit(1);
});
