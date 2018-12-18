let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs'); 

axios.get('https://actu17.fr/attentat-de-strasbourg-cherif-chekatt-a-ete-neutralise/')
    .then((response) => {
        if(response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html); 
            let devtoList = [];
            $('.twitter-tweet').each(function(i, elem) {
                devtoList[i] = {
                    url: $(this).find('.Tweet').attr('cite'),
                    text: $(this).find('.Tweet-text').text(),
                    tags: $(this).find('.PrettyLink-value').text().split('#')
                          .map(tag =>tag.trim())
                          .filter(function(n){ return n != "" })
                }      
            });
            const devtoListTrimmed = devtoList.filter(n => n != undefined )
            fs.writeFile('tweet_links.json', 
                          JSON.stringify(devtoListTrimmed, null, 4), 
                          (err)=> console.log('File successfully written!'))
    }
}, (error) => console.log(err) );