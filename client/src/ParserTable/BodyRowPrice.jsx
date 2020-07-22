import React from 'react';
import { Table } from 'semantic-ui-react';

const salesLengthStyle = {
    position: "absolute",
    top: "3px",
    right: "3px",
    fontSize: "13px",
    lineHeight: "12px",
    color: "#000000b3"
};

const priceInUsdStyle = {
    fontSize: "12px",
    color: "#000000b3"
}

const BodyRowPrice = ({ link, price, salesLength, priceInUsd }) => {
    if (priceInUsd === undefined || priceInUsd === 0) priceInUsd = "";
    if (price === "") salesLength = 0;
    return (
        <Table.Cell style={{ position: "relative" }}>
            {price !== 0 && <a href={link} target="_blank" rel="noopener noreferrer">
                {price}
                {priceInUsd !== "" && <span style={priceInUsdStyle}> ({priceInUsd})</span>}
            </a>}
            {salesLength !== 0 && <span style={salesLengthStyle}>{salesLength}</span>}
        </Table.Cell>
    );
};

export default BodyRowPrice;
