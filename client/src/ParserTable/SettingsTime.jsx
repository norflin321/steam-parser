import React from 'react';
import { Statistic } from 'semantic-ui-react';

const color = { color: "#D99962" }

const SettingsTime = ({ time, style }) => {
    return (
        <Statistic size="mini" inverted style={style}>
            <span>Bts: <span style={color} >{time.btsTime}</span></span>
            <span>Bts avg: <span style={color} >{time.bts_avgTime}</span></span>
            <span>Chine: <span style={color} >{time.chineTime}</span></span>
            <span>Steam: <span style={color} >{time.steamTime}</span></span>
        </Statistic>
    );
};

export default SettingsTime;
