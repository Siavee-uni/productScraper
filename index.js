require('dotenv').config()
const cron = require('node-cron');
const scrape = require('./modules/scrape');
const Telegram = require('./classes/telegramm.class');
const fs = require('fs');
const time = require('./modules/time');
// define data
const token = process.env.Tele_Token;
const telegramIds = {
    "ich": process.env.Tele_Id1,
    "alex": process.env.Tele_Id2
};
const urls = [
    "https://www.amazon.de/dp/B07DHT1QS6/",
    "https://www.amazon.de/dp/B07DHRWY2Y/",
    "https://www.amazon.de/dp/B08DNK43VY/"
];
// start 
(async() => {
    let task = false;
    cron.schedule('* * * * *', run)
    
    async function run() {
        if (task) {
            console.log("task took longer then 1min. Skipping task")
            return;
        }
        task = true;
        try {
            console.time('scraping-took');
            result = await scrape(token, telegramIds, urls)
            console.timeEnd('scraping-took');
            console.log("scraping succesfull "+ time.getTimeStemp("console"))
            task = false;
        } catch (error) {
            var logStream = fs.createWriteStream('log.txt', { flags: 'a' });
            // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
            logStream.write(JSON.stringify(error) + '\n');
            logStream.end();
            console.log(error);
        }
    }
})();
