const axios = require('axios');
const cheerio = require('cheerio');
const ora = require('ora');

const storer = require('./storer');
const domain = require('./domain');
const priceTransformer = require('./priceTransformer');

const spinner = ora({ text: '' });

module.exports = async (url, show = true) => {
  let title;
  let price;
  let availability;
  let priceFloat;
  let currency;

  if (show) {
    spinner.start(`Scraping`);
  }

  async function scrap() {
    let pageContent;
    try {
      pageContent = await axios.get(url);
    } catch (err) {
      spinner.fail(`Fail`);
      console.log(`Could not fetch any item. Are you using an amazon URL?`);
    }

    const $ = cheerio.load(pageContent.data);
    const presentations = $('body')
      .map((_, el) => {
        el = $(el);
        title = el.find('#productTitle').text().trim();
        price = el.find('#price_inside_buybox').text().trim();
        if (price === '') {
          price = el.find('#newBuyBoxPrice').text().trim();
        }
        availability = el
          .find('#availabilityInsideBuyBox_feature_div #availability span')
          .text()
          .trim();
        if (availability === '') {
          availability = el.find('#availability span').text().trim();
        }
        //console.log(title, price, availability);
      })
      .get();
  }

  await scrap();

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
    }
  } else {
    spinner.fail(`Fail`);
    console.log(`Could not fetch any item. Are you using an amazon URL?`);
  }
};
