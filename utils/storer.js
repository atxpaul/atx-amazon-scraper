const fs=require('fs');
const path=require('path');
const makeDir=require('make-dir');


//Database
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbArticles = path.join(process.cwd(),`.articles/articles.json`);



exports.insertOrUpdate = async(article)=>{

    if(!fs.existsSync(dbArticles)){
        await makeDir(`.articles`);
        process.chdir(`.articles`);
        fs.writeFileSync(`articles.json`,`{}`)
    }

    const adapter = new FileSync(dbArticles);
    const db=low(adapter);

    if(db.get(`articles`).find({title:article.title}).value()){
        //console.log(`Found Article: ${article.title}`);
        db.get(`articles`).find({title:article.title}).assign({date:article.date,price:article.price,availability:article.availability}).write();
    }
    else {
        //console.log(`Article not found on DB, writing`);
        db.defaults({articles:[]}).write();
        db.get(`articles`).push(article).write();
    }


}

exports.findAll = async()=>{
    const adapter = new FileSync(dbArticles);
    const db=low(adapter);
    const urls= db.get(`articles`).map(`url`).value();
    return urls;
}