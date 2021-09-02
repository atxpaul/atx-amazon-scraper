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


//TODO: Es necesario el market?

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

    if (input[0].includes(`amazon.es`)){
            await(scrap(input[0],`ES`));
    }   else if (input[0].includes(`amazon.com`)){
            await(scrap(input[0],`COM`));
    }   else {
        //Testing si funciona con URL de amazon de otros países.
        await(scrap(input[0],`COM`));
        //console.log(`Cannot scrap URL, check it. Only available on amazon ES and COM`);
    }
    

    debug && log (flags, input);
})();