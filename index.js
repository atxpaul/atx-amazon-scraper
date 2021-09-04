#!/usr/bin/env node

/*
*cli-scraper
*A simple cli for web-scrapping
*
* @author atxpaul <https://twitter.com/code4paul>
*
**/

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const scrap = require('./utils/scrap');
const storer = require('./utils/storer');



const input=cli.input;
const flags=cli.flags;
const {clear,debug,minimal}=flags;

//IIFE
(async()=>{
    init({clear,minimal});
    input.includes('help') && cli.showHelp(0);
    //console.log(input, input[0].includes(`amazon.es`));

    //COMMAND: todo view or todo ls
    if (input.includes(`view`)||input.includes(`ls`)){
        const allUrl= await storer.findAll();
        if (allUrl.length>0){
            for(i=0;i<allUrl.length;i++){
                await(scrap(allUrl[i],`COM`));
            }
        }
        else {
            console.log(`You cannot view any articles if you don't search for any of them before`)
        }        
        process.exit(0);
    }

    //Search for URL
    await(scrap(input[0]));
    

    debug && log (flags, input);
})();