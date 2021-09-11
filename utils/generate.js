const ora = require('ora');
const chalk = require('chalk');

const green = chalk.green;

const storer = require('./storer');
const domain = require('./domain');
const priceTransformer = require('./priceTransformer');
const questions = require('./questions');
const scraper = require('./scrap');

const spinner = ora({ text: '' });

module.exports = async (url, show = true) => {
  let title;
  let price;
  let availability;
  let priceFloat;
  let currency;

  if (url == '') {
    const vars = await questions();
    url = vars.url;
    console.log(`The input was ${url}`);
  }

  if (show) {
    spinner.start(`Scraping`);
  }

  const dataScraped = await scraper.scrap(url);

  title = dataScraped.title;
  price = dataScraped.price;
  availability = dataScraped.availability;

  if (title != '') {
    if (show) {
      spinner.succeed(`Done`);
      spinner.stop();
    }
    if (price != '') {
      priceFloat = await priceTransformer.extractMoney(price);
      currency = await priceTransformer.extractCurrency(price);
    } else {
      priceFloat = 99999.0;
      currency = '';
    }
    if (availability.indexOf(`\n`) > 1) {
      availability = availability.substr(0, availability.indexOf(`\n`));
    }
    const urlDomain = await domain.extractDomain(url);
    const event = new Date();
    const jsonDate = event.toJSON();
    const articleStatus = {
      title: title,
      price: priceFloat,
      currency: currency,
      availability: availability,
      date: jsonDate,
      domain: urlDomain,
      url: url,
      minPrice: {
        minPriceDate: jsonDate,
        minPrice: priceFloat,
        minPriceCurrency: currency,
      },
    };
    const isLowestPrice = await storer.insertOrUpdate(articleStatus);
    if (isLowestPrice || show) {
      console.log(`Title: ${title}`);
      console.log(`Price: ${price}`);
      console.log(`Availability: ${availability}`);
      console.log(`URL: ${url}`);
      if (isLowestPrice)
        console.log(`${green(`This article has lower its price! Check it!`)}`);
    }
  } else {
    spinner.fail(`Fail`);
    console.log(`Could not fetch any item. Are you using an amazon URL?`);
  }
};
