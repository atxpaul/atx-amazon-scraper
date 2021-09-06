const axios = require('axios');
const cheerio = require('cheerio');
const ora = require('ora');

const storer = require('./storer');
const domain = require('./domain');
const priceTransformer = require('./priceTransformer');

const spinner = ora({ text: '' });

module.exports = async (url) => {
  let title;
  let price;
  let availability;

  spinner.start(`Scraping`);

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
    spinner.succeed(`Done`);
    spinner.stop();
    const priceFloat = await priceTransformer.extractMoney(price);
    const currency = await priceTransformer.extractCurrency(price);
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
    storer.insertOrUpdate(articleStatus);
    console.log(`Title: ${title}`);
    console.log(`Price: ${price}`);
    console.log(`Availability: ${availability}`);
  } else {
    spinner.fail(`Fail`);
    console.log(`Could not fetch any item. Are you using an amazon URL?`);
  }
};
