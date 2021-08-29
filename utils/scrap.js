const scrapeIt = require("scrape-it");
const ora=require('ora');

const spinner=ora({text:''})


module.exports=async(url,market)=>{
    let titleIdTag;
    let priceIdTag;
    let availabilityIdTag;
    let dataResult;
    let title;
    let price;
    let availability;

//TODO: En algunos artículos el precio en ES no es newBuyBoxPrice y es el mismo id que en COM, price_inside_buybox.
//TODO: Para hacer esto, vamos a tener que leer todos los tags del website con cheerio y buscar si existen los que necesitamos.

    spinner.start(`Scraping`)
    titleIdTag="#productTitle";
    priceIdTag="#price_inside_buybox";
    availabilityIdTag="#availabilityInsideBuyBox_feature_div #availability span";



    // if (market==='ES'){

    //     priceIdTag="#newBuyBoxPrice";
    //     availabilityIdTag="#availabilityInsideBuyBox_feature_div #availability span";
    // } else if (market === 'COM'){

    //     priceIdTag="#price_inside_buybox";
    //     availabilityIdTag="#availability span";
    // }
    //console.log(`Going to scrap on amazon ${market}`);


    //Scraping all for title
    await scrapeIt(url, {
        title: titleIdTag
        , price: priceIdTag
        , availability: availabilityIdTag
        
    }).then(({ data, response }) => {
            title=data.title;
            price=data.price;
            availability=data.availability;
        });

    //if not title, exit    
    if (title===''){
        spinner.fail(`Could not fetch any item. Are you using an amazon URL?`);
        console.log(`Title: `)
        console.log(`Price: `)
        console.log(`Availability: `);
        process.exit(0);
    }

    //if not price, new tag option
    if (price===''){
        priceIdTag="#newBuyBoxPrice";
    }

    await scrapeIt(url, {
        price: priceIdTag
        
    }).then(({ data, response }) => {
            price=data.price;
        });

    //if not price, new tag option
    if (price===''){
            priceIdTag="#price";
    }
    await scrapeIt(url, {
        price: priceIdTag
        
    }).then(({ data, response }) => {
            price=data.price;
        });

    //if not availability, new tag option
    if (availability===''){
        availabilityIdTag="#availability span";
    }
    await scrapeIt(url, {
        availability: availabilityIdTag
        
    }).then(({ data, response }) => {
            availability=data.availability;
        });


    
    if (title!=''){
        spinner.succeed(`Done`)
        spinner.stop();
        
        console.log(`Title: ${title}`);
        console.log(`Price: ${price}`)
        console.log(`Availability: ${availability}`)
    }

}
