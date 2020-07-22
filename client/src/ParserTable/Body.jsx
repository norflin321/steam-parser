import React from 'react';
import { Table } from 'semantic-ui-react';
import BodyRow from './BodyRow';

const Body = ({ shownItems, usdPrice }) => {
    return <Table.Body>{shownItems && shownItems.map((i, index) => <BodyRow key={index} item={i} usdPrice={usdPrice} />)}</Table.Body>;
};

export default Body;
