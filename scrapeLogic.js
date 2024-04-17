const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res, language, promoter) => {
  // console.log(language, promoter);
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto(
      `https://api.swasthyasamadhan.com/pdf/poster/${promoter}?language=${language}`,
      {
        waitUntil: "networkidle0",
      }
    );



    // Set screen size

    await page.setViewport({ width: 420, height: 594, deviceScaleFactor: 8 });
    let nextjsPortal = await page.$("nextjs-portal");
    if (process.env.NODE_ENV === "production") {
      await nextjsPortal?.evaluate((el) =>
        el.setAttribute("style", "display:none !important")
      );
    } else {
      await nextjsPortal?.evaluate((el) =>
        el.setAttribute("style", "display:none !important")
      );
    }
    await page.addStyleTag({
      content: `nextjs-portal {
        display: none !important;
      }`,
    });

    await page.waitForFunction(async () => {
      await new Promise((resolve) => {
        setTimeout(() => resolve(true), 15_000)
      })
    })

    const pdf = await page.pdf({
      width: `${1 * 393}px`,
      height: `${1 * 595}px`,
      printBackground: true,
      // ! For Downloading the PDF
      // path: `${promoter.charAt(0).toUpperCase()}${promoter.substring(
      //   1
      // )}'s ${language.charAt(0).toUpperCase()}${language.substring(1)} Poster`,
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });

    res.set("Content-Type", "application/pdf");
    res.status(200).send(pdf);
  } catch (e) {
    console.error(e);
    res.status(400).send(`Something went wrong with the service.`);
  } finally {
    await browser.close();
    return;
  }
};

module.exports = { scrapeLogic };
