const puppeteer = require("puppeteer");
const UserAgent = require("user-agents");

const Agent = new UserAgent();
(async () => {
  

    let url = "";
    // prepare for headless chrome
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // generate new user Agent
    const device = new UserAgent();
    // set user agent (override the default headless User Agent)
    await page.setUserAgent(device.toString());

    // go to adress home page
    await page.goto(url);
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: '/tmp'
    })
    let url2 = await page.evaluate(() => {
        let el = document.querySelector(".singleGamePlayer").getAttribute('data-flv-url');
        return el;
    })
    // get price
    let name = await page.evaluate(() => {
        let el2 = document.querySelector('h1[itemprop=name]').textContent;
        return el2;
    })
    console.log(url2);
    console.log(name);
    let array = [
        url2,
        name
    ]
    await browser.close();
    const fs = require('fs');


    var logStream = fs.createWriteStream('log.txt', {flags: 'a'});
    // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
    logStream.write(JSON.stringify(array) + '\n');
    logStream.end('\n');

})
 ();

