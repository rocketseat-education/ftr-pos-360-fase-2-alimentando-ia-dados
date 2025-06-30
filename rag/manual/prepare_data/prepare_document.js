import * as cheerio from 'cheerio';

const url = "https://eloquentjavascript.net/1st_edition/print.html";

const htmlString = await fetch(url).then(r => r.text());
const $ = cheerio.load(htmlString);
const documents = $(".block").toArray().map(block => $(block).text());

console.log(documents.length);