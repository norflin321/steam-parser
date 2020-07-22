import React, { useState, useEffect, useReducer } from 'react';
import { Container, Table } from 'semantic-ui-react';
import Body from './Body';
import Header from './Header';
import Settings from './Settings';
import reducer from './reducer';

const ParserTable = () => {
    const [data, setData] = useState({});
    const [shownItems, dispatch] = useReducer(reducer, []);
    const [direction, setDirection] = useState({ from: '', to: '' });
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minPercent, setMinPercent] = useState('');
    const [maxPercent, setMaxPercent] = useState('');
    const [btsDays, setBtsDays] = useState("");
    const [btsSales, setBtsSales] = useState("");
    const [btsBtnLoading, setBtsBtnLoading] = useState(false);
    const [usdPrice, setUsdPrice] = useState("")

    const getData = async () => {
        // get data
        const res = await fetch(`/api/matches`).then(res => res.json()).then(res => {
            setUsdPrice(res.usdPrice);
            return res;
        }).catch(err => console.log(err));

        res && setData(res);
        console.log(res);
    };

    // on first mount
    useEffect(() => {
        // get data
        getData();
        let interval = setInterval(getData, 40 * 1000);
        return () => clearInterval(interval);
    }, []);

    // run when ... changed
    useEffect(() => {
        if (data.db) {
            changeBtsAvg();
        }
    }, [data, direction, search, minPrice, maxPrice, minPercent, maxPercent ]);

    // handle direction select
    const selectDirection = e => {
        const value = e.target.innerText;
        if (direction.from === '') {
            setDirection({ from: value, to: '' });
        } else if (direction.to === '') {
            direction.from !== e.target.innerText && setDirection({ from: direction.from, to: value });
        } else {
            setDirection({ from: value, to: '' });
        }
    };

    useEffect(() => {
        console.log(shownItems);
    }, [shownItems]);

    // filter bts avg sales and calculate new avg price
    const changeBtsAvg = async () => {
        if (data.db && usdPrice) {
            // loading
            setBtsBtnLoading(true);
            document.body.style.cursor="wait";
            await new Promise(resolve => setTimeout(resolve, 200));
            //
            let localBtsDays = btsDays;
            let localBtsSales = btsSales;
            localBtsDays === "" ? localBtsDays = Number.MAX_SAFE_INTEGER : localBtsDays = parseInt(localBtsDays);
            localBtsSales === "" ? localBtsSales = 0 : localBtsSales = parseInt(localBtsSales);

            let newDataItems = [];
            let dataItems = data.db.slice();
            for (let i of dataItems) { // start loop
                // filter bts-avg sales
                let newSales = [];
                for (let sale of i.bts_avg.sales) {
                    // difference in days between now and provided timestamp               
                    if (Math.floor((Date.now() - sale.t*1000) / (1000 * 60 * 60 * 24)) < localBtsDays) {
                        // sale.t = new Date(sale.t*1000).toLocaleString("ru-RU", {timeZone: "Europe/Moscow"}).split(",")[0];
                        newSales.push(sale);
                    }
                }
                i.bts_avg.sales = newSales;

                // count new avg price for all sales, after filter
                if (i.bts_avg.sales.length !== 0) {
                    let newAvg = 0;
                    for (let sale of i.bts_avg.sales) {
                        newAvg += sale.p;
                    }
                    newAvg = Math.round(((newAvg / i.bts_avg.sales.length) * usdPrice) * 100) / 100;
                    i.bts_avg.avg = newAvg;
                } else {
                    i.bts_avg.avg = "";
                }

                // filter by btsSales
                if (i.bts_avg.sales.length < localBtsSales) {
                    i.bts_avg.avg = "";
                }
                newDataItems.push(i);
            } // end loop
            setBtsBtnLoading(false);
            document.body.style.cursor="default";
            dispatch({
                payload: newDataItems,
                direction: direction,
                search: search,
                minPrice: minPrice,
                maxPrice: maxPrice,
                minPercent: minPercent,
                maxPercent: maxPercent
            });
        }
    }

    return (
        <Container>
            <Settings
                time={{ btsTime: data.btsTime, bts_avgTime: data.bts_avgTime, chineTime: data.chineTime, steamTime: data.steamTime }}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                shownItemsLength={shownItems.length}
                minPercent={minPercent}
                setMinPercent={setMinPercent}
                maxPercent={maxPercent}
                setMaxPercent={setMaxPercent}
                btsDays={btsDays}   
                setBtsDays={setBtsDays}
                btsSales={btsSales}
                setBtsSales={setBtsSales}
                changeBtsAvg={changeBtsAvg}
                btsBtnLoading={btsBtnLoading}
                usdPrice={usdPrice}
            />
            <Table className="parser-table" celled striped style={{ marginTop: 30 }}>
                <Header selectDirection={selectDirection} direction={direction} setSearch={setSearch} searchValue={search} />
                <Body shownItems={shownItems.slice(0, 50)} usdPrice={usdPrice}/>
            </Table>
        </Container>
    );
};

export default ParserTable;
