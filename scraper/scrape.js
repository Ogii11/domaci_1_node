const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs')

var data = [];
var rawData = [];

function toCSV(){
    rawData.forEach((e,i) => {
        var oglas = {
            oglasio: e.substring(0, e.indexOf("iznajmljuje")).replace(/\t|\n/g,""),
            brojSoba: e.substring(e.indexOf("period")+6, e.indexOf("sobe")+4).replace(/\t|\n/g,""),
            stambenaPovrsina: e.substring(e.indexOf("sobe")+5, e.indexOf("m2")+2).replace(/\t|\n/g,""),
            cijena: e.substring(e.indexOf("€"), e.indexOf("€")+4).replace(/\t|\n/g,""),
            podrucje: e.split(" ")[12].replace(/\t|\n/g,""),
            lokacija: e.split(" ")[13].replace(/\t|\n/g,""),
            detalji: e.substring(e.indexOf(", Crna Gora")+ 25 , e.indexOf("Detaljno")).replace(/\t|\n/g,""),
            link: e.substring(e.indexOf("link do stana:")+14,)
        }
        var zaUpis =  `\n${oglas.oglasio}, ${oglas.brojSoba}, ${oglas.stambenaPovrsina}, ${oglas.cijena}, ${oglas.podrucje}, ${oglas.detalji}, ${oglas.link}`;
        fs.appendFile("./data.csv", zaUpis, (err)=> {
            if(err){
                console.log(err)
            }
        })
    })
}

function getStanove(i){
    axios.get(`https://www.realitica.com/?cur_page=${i}&type=Apartment&for=DuziNajam&lng=hr&pZpa=Crna+Gora`)
    .then(e => {
        const $ = cheerio.load(e.data);
        $("body").find('div[style="padding:15px 10px;clear:both;white-space: normal; overflow: hidden; text-overflow: ellipsis; border: 1px solid #ccc; background:#fff9dd;"]')
        .toArray()
        .forEach(e => {
            var link;
            $(e).find("a").each((i,e) => {
                link = e.attribs.href;
            })
            rawData.push($(e).text() + `link do stana:${link}`);
        })
        if(i == 9) {
            toCSV();
        }
    })
}

for(var i = 0; i < 10; i++){
    getStanove(i);
}
