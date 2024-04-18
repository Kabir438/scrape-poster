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
      '--font-render-hinting=none',
      "--force-color-profile=srgb"
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    timeout: 90_000
  });
  try {
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");


    await page.setViewport({ width: 420, height: 594, deviceScaleFactor: 8 });

    await page.goto(
      `https://swasthyasamadhan.com/poster/${promoter}?language=${language}`,
      {
        waitUntil: "networkidle0",
      }
    );



    // Set screen size

    
    await page.evaluate(() => {
      const selectors = Array.from(document.images);
      return Promise.all(selectors.map(img => {
         if (img.complete) {
            return Promise.resolve();
         }
         return new Promise((resolve, reject) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', reject);
         });
      }));
   });

   await page.evaluateHandle('document.fonts.ready');

    // await page.waitForFunction(async () => {
    //   await new Promise((resolve) => {
    //     setTimeout(() => resolve(true), 15_000/3)
    //   })
    // })

    await page.emulateMediaType('screen');

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