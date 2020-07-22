const express = require('express');
const rp = require('request-promise');
const app = express();
const path = require('path');
const totp = require('notp').totp;
const base32 = require('thirty-two');
const code = () => totp.gen(base32.decode(''));
const btsKey = '';

let full_data = {
    db: [],
    btsTime: "",
    bts_avgTime: "",
    chineTime: "",
    steamTime: "",
    usdPrice: ""
};

// api
app.use(express.json());
app.use(express.static(path.join(__dirname, '/build')));
app.get('/table', (req, res) => res.sendFile(path.join(__dirname + '/build/index.html')));
app.get('/api/matches', (req, res) => res.json(full_data));

// main function
const parser = async () => {
    console.log('----- new -----');

    // get usd price
    const getUsdUri = "http://www.cbr.ru/scripts/XML_daily.asp";
    let usdPrice = await rp({ uri: getUsdUri, json: true }).catch(err => console.log(err));
    usdPrice = usdPrice.slice(usdPrice.indexOf("USD"));
    usdPrice = usdPrice.slice(usdPrice.indexOf("<Value>") + "<Value>".length, usdPrice.indexOf("</Value>")).trim().replace(",", ".");
    usdPrice = Math.round(parseFloat(usdPrice) * 100) / 100;

    // bts
    let bts_db = await rp({
        uri: ``,
        json: true,
        timeout: 20*1000
    }).catch(err => console.log('bts parser err'));

    // err or no data check
    if (!bts_db || !bts_db.data || !bts_db.data.items || bts_db.data.items.length == 0) {
        console.log("no bts data, restart after 10 sec...")
        setTimeout(parser, 10 * 1000);
        return;
    }

    bts_db = bts_db.data.items;
    let btsTimeUpdate = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false });
    console.log(`Parsed from bits: ${bts_db.length} | ${btsTimeUpdate}`);

    // bts avg
    let bts_avg = await rp({ uri: "", json: true });
    console.log(`Parsed from bts-avg: ${Object.keys(bts_avg.items).length} | ${bts_avg.time}`);

    // c5
    let chine_db = await rp({ uri: ``, json: true }).catch(err => console.log('chineParser error'));
    console.log(`Parsed from chine: ${chine_db.db.length} | ${chine_db.time}`);

    // steam
    let steam_db = await rp({ uri: ``, json: true  }).catch(err => console.log('steam parser error'));
    console.log(`Parsed from steam: ${Object.keys(steam_db.db).length} | ${steam_db.time}`);

    // err checks
    if (!steam_db.db || Object.keys(steam_db.db).length == 0) {
        console.log("no steam data, restart after 30 sec...")
        setTimeout(parser, 30 * 1000);
        return;
    }
    if (!chine_db.db || chine_db.db.length == 0) {
        console.log("no chine data, restart after 30 sec...")
        setTimeout(parser, 30 * 1000);
        return;
    }
    if (!bts_avg.items || Object.keys(bts_avg.items).length == 0) {
        console.log("no bts avg data, restart after 1 min...")
        setTimeout(parser, 1 * 60 * 1000);
        return;
    }

    // convert chine db from array to object: { name: {...data} }
    let newChineObj = {};
    for (i of chine_db.db) {
        newChineObj[i.name] = { ...i };
    }
    chine_db.db = newChineObj;

    // convert bits db from array to object: { name: {...data}  }
    let newBtsDb = {};
    for (i of bts_db) {
        newBtsDb[i.market_hash_name] = { ...i };
    }
    bts_db = newBtsDb;

    // find matches
    const matches = [];
    for (let i of Object.keys(steam_db.db)) {
        // convert steam item price from cents to rub
        steam_db.db[i] = {
            sell_price: Math.round(((steam_db.db[i].sell_price / 100) * usdPrice) * 100) / 100,
            sell_listings: steam_db.db[i].sell_listings
        }

        // find in chine
        let foundInChine = chine_db.db[i];
        let c5ItemData;
        if (foundInChine) {
            c5ItemData = {
                price: Math.round((foundInChine.price * 10) * 100) / 100,
                link: `https://www.c5game.com${foundInChine.link}?quick=open`,
                quantity: foundInChine.onSelling,
                buy_offer: Math.round((foundInChine.buy_offer * 10) * 100) / 100,
                offer_link: `https://www.c5game.com${foundInChine.offer_link}`,
            };
        } else {
            c5ItemData = {
                price: '',
                link: '',
                quantity: '',
                buy_offer: '',
                offer_link: '',
            };
        }

        // find in bts
        let foundInBts = bts_db[i];
        let btsItemData;
        if (foundInBts) {
            btsItemData = {
                lowest_price: Math.round(((parseFloat(foundInBts.lowest_price)) * usdPrice) * 100) / 100,
                recent_sales_info: foundInBts.recent_sales_info,
                lowest_price_usd: Math.round((parseFloat(foundInBts.lowest_price)) * 100) / 100
            };
        } else {
            btsItemData = {
                lowest_price: "",
                recent_sales_info: ""
            };
        }

        // find in bts avg
        let foundInBts_avg = bts_avg.items[i];
        let bts_avgItemsData;
        if (foundInBts_avg) {

            // count avg of all sales
            let avg;
            if (foundInBts_avg.length === 0) {
                avg = ""
            } else {
                avg = 0;
                for (let sale of foundInBts_avg) {
                    avg += sale.p;
                }
                avg = Math.round(((avg / foundInBts_avg.length) * usdPrice) * 100) / 100;
            }

            bts_avgItemsData = {
                sales: foundInBts_avg,
                avg: avg
            };
        } else {
            bts_avgItemsData = {
                sales: [],
                avg: ""
            };
        }

        if (foundInChine || foundInBts || foundInBts_avg) {
            matches.push({ name: i, steam: steam_db.db[i],  c5: c5ItemData, bts: btsItemData, bts_avg: bts_avgItemsData });
        }

    }

    console.log("Matches length: ", matches.length);

    // set all items and time
    let newFullData = {
        db: matches,
        btsTime: btsTimeUpdate,
        bts_avgTime: bts_avg.time,
        chineTime: chine_db.time,
        steamTime: steam_db.time,
        usdPrice: usdPrice
    };
    if (matches != 0) full_data = newFullData;
    setTimeout(parser, 1 * 60 * 1000);
};
parser();

//
let port = process.env.PORT || 5000;
app.listen(port);
