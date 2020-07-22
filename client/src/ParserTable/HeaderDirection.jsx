import React from 'react';
import { Table } from 'semantic-ui-react';

const HeaderDirection = ({ value, selectDirection }) => (
  <Table.HeaderCell className="direction" onClick={(e) => selectDirection(e)}>
    {value}
  </Table.HeaderCell>
);

export default HeaderDirection;
