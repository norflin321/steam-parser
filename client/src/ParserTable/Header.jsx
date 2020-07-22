import React from 'react';
import { Table } from 'semantic-ui-react';
import HeaderSearch from './HeaderSearch';
import HeaderDirection from './HeaderDirection';

const Header = ({ direction, selectDirection, searchValue, setSearch }) => {
  return (
    <Table.Header>
      <Table.Row>
        <HeaderSearch searchValue={searchValue} setSearch={setSearch} />
        <HeaderDirection selectDirection={selectDirection} value="SM" />
        <HeaderDirection selectDirection={selectDirection} value="BTS" />
        <HeaderDirection selectDirection={selectDirection} value="BTS-AVG" />
        <HeaderDirection selectDirection={selectDirection} value="C5" />
        <HeaderDirection selectDirection={selectDirection} value="C5(A)" />
        <Table.HeaderCell>{`${direction.from} ${direction.to}`}</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};

export default Header;
