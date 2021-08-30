const fs=require('fs');
const path=require('path');
const makeDir=require('make-dir');


//Database
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbArticles = path.join(process.cwd(),`.articles/articles.json`);



module.exports=async(article)=>{

    if(!fs.existsSync(dbArticles)){
        await makeDir(`.articles`);
        process.chdir(`.articles`);
        fs.writeFileSync(`articles.json`,`{}`)
    }

    const adapter = new FileSync(dbArticles);
    const db=low(adapter);
    db.defaults({articles:[]}).write();



    db.get(`articles`).push(article).write();

}