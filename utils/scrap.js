const scrapeIt = require("scrape-it");
const ora=require('ora');

const spinner=ora({text:''})

    //https://www.amazon.es/gp/product/B08C7KG5LP?pf_rd_r=3N979NNS9X04ASJF73SX&pf_rd_p=c6fa5af0-ec7c-40de-8332-fd1421de4244&pd_rd_r=1ec935c8-05f7-4f2d-a3b8-d206e72d8c09&pd_rd_w=dkPxS&pd_rd_wg=vPIMV&ref_=pd_gw_unk
    //TO-DO SÓLO VALE PARA AMAZON.ES. Los ID en AMAZON.COM son diferentes.

module.exports=async(url,market)=>{
    let title;
    let price;
    let availability;


    if (market==='ES'){
        title="#productTitle";
        price="#newBuyBoxPrice";
        availability="#availabilityInsideBuyBox_feature_div #availability span";
    } else if (market === 'COM'){
        title="#productTitle";
        price="#price_inside_buybox";
        availability="#availability span";
    }
    //console.log(`Going to scrap on amazon ${market}`);


    spinner.start(`Scraping`)
    scrapeIt(url, {
        title: title
        , price: price
        , availability: availability
        
    }).then(({ data, response }) => {
        
        if (data.title){
            spinner.succeed(`Done`)
            spinner.stop();
            
            console.log(`Title: ${data.title}`);
            console.log(`Price: ${data.price.trim()}`)
            console.log(`Availability: ${data.availability}`)
        }
        else {
            spinner.fail(`Could not fetch any item. Are you using an amazon URL?`);
            console.log(`Title: `)
            console.log(`Price: `)
            console.log(`Availability: `)
        }
        
    });
}
