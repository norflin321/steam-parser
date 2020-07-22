import React from 'react';
import { Table } from 'semantic-ui-react';
import BodyRowPrice from './BodyRowPrice';

const BodyRow = ({ item, usdPrice }) => {
    return (
        <Table.Row>
            <Table.Cell>{item.name}</Table.Cell>
            <BodyRowPrice link={`https://steamcommunity.com/market/listings/570/${item.name.split(" ").join("%20")}`} price={item.steam.sell_price} />
            <BodyRowPrice 
                link={`https://bitskins.com/deals?market_hash_name=${item.name.split(" ").join("+")}`}
                price={item.bts.lowest_price}
                priceInUsd={Math.round((item.bts.lowest_price / usdPrice) * 100) / 100}
            />
            <BodyRowPrice
                link={`https://bitskins.com/price/?market_hash_name=${item.name.split(" ").join("%20")}#itemPriceChart`}
                price={item.bts_avg.avg}
                salesLength={item.bts_avg.sales.length}
                priceInUsd={Math.round((item.bts_avg.avg / usdPrice) * 100) / 100}
            />
            <BodyRowPrice link={item.c5.link} price={item.c5.price} />
            <BodyRowPrice link={item.c5.offer_link} price={item.c5.buy_offer} />
            <Table.Cell className="percent">
                {item.percent}
                {item.percent && '%'}
            </Table.Cell>
        </Table.Row>
    );
};

export default BodyRow;
