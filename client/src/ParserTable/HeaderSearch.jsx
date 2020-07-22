import React from 'react';
import { Table } from 'semantic-ui-react';

const HeaderSearch = ({ searchValue, setSearch }) => {
  return (
    <Table.HeaderCell>
      <div className="ui input search">
        <input type="text" placeholder="Search..." value={searchValue} onChange={e => setSearch(e.target.value)} />
        {searchValue.length > 0 && <i aria-hidden="true" className="close icon" onClick={e => setSearch('')}></i>}
      </div>
    </Table.HeaderCell>
  );
};

export default HeaderSearch;
