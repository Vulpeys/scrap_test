let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');

axios.get('https://actu17.fr/attentat-de-strasbourg-cherif-chekatt-a-ete-neutralise/')
    .then((response) => {
        if(response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html); 
            let devtoList = [];
            const name = $(html).find('h1').text();
            console.log(name);
            $('p[dir="ltr"]').each(function(i, elem) {
                 devtoList[i] = {
                     text: $(this).text(),
                     tags: $(this).find('a').text().split('#')
                           .map(tag =>tag.trim())
                           .filter(function(n){ return n != "" }),
                     url: $(this).find("a").attr("href")
                 }      
            });
            const devtoListTrimmed = devtoList.filter(n => n != undefined )
            fs.writeFile(`${name}.json`, 
                          JSON.stringify(devtoListTrimmed, null, 4), 
                          (err)=> console.log('File successfully written!'))
    }
}, (error) => console.log(err) );