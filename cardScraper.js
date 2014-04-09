require('console-ten').init(console);

console.log('scraping card images!');
var CardImageScraper = require('./scrapers/CardImageScraper');
CardImageScraper.scrapeCards();