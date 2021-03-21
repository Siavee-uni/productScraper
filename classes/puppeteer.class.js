const puppeteer = require("puppeteer");
const UserAgent = require("user-agents");
const fs = require("fs");
const time = require('../modules/time');
const Agent = new UserAgent();

class Scraper {
    constructor() {
        this.url = [];
        this.loglv;
    }

    setUrl(urlArray) {
        this.url = urlArray;
    }
    setLogLv(boolean) {
        this.loglv = boolean;
    }
    async getPage() {

        if (!fs.existsSync("screenshots")) {
            fs.mkdirSync("screenshots");
        }
        // prepare for headless chrome
        const args = [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-infobars",
            "--window-position=0,0",
            "--ignore-certifcate-errors",
            "--ignore-certifcate-errors-spki-list",
        ];

        const options = {
            args,
            headless: true,
            ignoreHTTPSErrors: true,
            slowMo: 250,
        };
        let browser = null;
        let urls = [];

        try {
            browser = await puppeteer.launch(options);

            const page = await browser.newPage();
            // generate new user Agent
            const device = new UserAgent();
            // set user agent (override the default headless User Agent)
            await page.setUserAgent(device.toString());
            await page.setViewport({ width: 1080, height: 1080 });

            for (let url of this.url) {
                // go to adress home page
                await page.goto(url);
                // check for product awailability
                if (this.loglv) {
                    await page.screenshot({ path: "screenshots/catpcha" + time.getTimeStemp("file") + ".jpeg" });
                }
                
                let available = await page.evaluate(() => {
                    let el = document.querySelector("#availability span");
                    let value = el ? el.innerText : false;
                    return value;
                });
                // check if on amazon site
                let captcha = await page.evaluate(() => {
                    let el = document.querySelector("#nav-main");
                    return el ? false : true;
                });
                // get add to card el
                let cardButton = await page.evaluate(() => {
                    let el = document.querySelector("#add-to-cart-button");
                    return el ? true : false;
                });
                // get price
                let price = await page.evaluate(() => {
                    let text = document.querySelector("#priceblock_ourprice");
                    return text ? text.innerText : false;
                });
                
                let output = {
                    "captcha": captcha,
                    "available": available,
                    "url": url,
                    "cardButton": cardButton,
                    "price": price,
                };
                // push ouput to array
                urls.push(output);

                if (captcha) {
                    await page.screenshot({ path: "screenshots/catpcha" + time.getTimeStemp("file") + ".jpeg" });
                }
                if (cardButton) {
                    await page.screenshot({ path: "screenshots/catpcha" + time.getTimeStemp("file") + ".jpeg" });
                }
            }
        } catch (err) {
            console.log(`Error: ${err.message}`);
        } finally {
            if (browser) {
                await browser.close();
            }
            return urls;
        }
    }
}

module.exports = Scraper;