const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

axios.get('https://actu17.fr/attentat-de-strasbourg-cherif-chekatt-a-ete-neutralise/')
    .then((response) => {
        if(response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html); 
            let scrapedList = [];
            const name = $(html).find('h1').text().replace(/ /gi, '_');
            $('p[dir="ltr"]').each(function(i, elem) {
                $(this).find("a:last-child").remove();
                 scrapedList[i] = {
                    text: $(this).text(),
                    tags: $(this).find('a')
                    .filter((i, txt) => $(txt).text()[0] == '#')
                    .text()
                    .split('#')
                    .map(tag => tag.trim())
                    .filter(function(n){ return n != "" }),
                    url: $(this).find("a:last-child").attr("href")
                 }      
            });
            const scrapedListTrimmed = scrapedList.filter(n => n != undefined )
            fs.writeFile(`${name}.json`, 
                          JSON.stringify(scrapedListTrimmed, null, 4), 
                          (err)=> console.log('File successfully written!'))
    }
}, (error) => console.log(err) );