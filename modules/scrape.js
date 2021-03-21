const Scraper = require('../classes/puppeteer.class');
const Telegram = require('../classes/telegramm.class');

const scrape = async function scape(token, telegramIds, urls) {

    // inicialice class
    let scraper = new Scraper;
    scraper.setUrl(urls);
    // set true for screenshots
    scraper.setLogLv(true);
    let telegram = new Telegram(token);
    telegram.setIds(telegramIds);
    // get page content
    let results = await scraper.getPage();
    //check if pupeteer return array
    if (!Array.isArray(results)) {
        console.log("puppeteer failed to scrape pages")
        return;
      }
    for (let result of results) {
        // check for amazon captcha
        if (result.captcha === true) {
            console.log("Prozess failed because of Amazon captcha");
            continue;
        }
        let compareString = result.available.toLowerCase();
        compareString = compareString.replace('.','');
        if (compareString === false){
            continue;
        }
        if (compareString == "derzeit nicht auf lager" || compareString == "derzeit nicht verfügbar") {
            continue;
        } else {
            console.log("verfügbar" + result.url)
            telegram.setMessage(result.url + " ist für " + result.price + " verfügbar");
            telegram.sendMessage();
        }
    }
    return false;
};

module.exports = scrape;