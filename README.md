#`npx atx-amazon-scraper`

This is a simple scraper for articles in amazon ES and amazon COM

##Usage

To use this CLI run the following command

```sh
npx atx-amazon-scraper "https://amazon.es/yoururl"
```

You can also install globally and scrap when you want

```sh
npm i -g atx-amazon-scraper
```

Then you can run

```sh
scrap "https://amazon.es/yoururl"
```

All articles you scrap will be stored. If you want to check if anyone has lower price than before, just use

```sh
scrap check
```
