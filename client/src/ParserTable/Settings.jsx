import React from 'react';
import { Statistic } from 'semantic-ui-react';
import SettingsInput from './SettingsInput';
import SettingsTime from './SettingsTime';
import { Input } from 'semantic-ui-react'
import { Icon } from 'semantic-ui-react'

const inputStyle = { width: "60px", height: "25px" };
const alignItems = { display: "flex", alignItems: "center" }

const Settings = ({
    time,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    minPercent, setMinPercent,
    maxPercent, setMaxPercent,
    shownItemsLength,
    btsDays, setBtsDays,
    btsSales, setBtsSales,
    changeBtsAvg,
    btsBtnLoading,
    usdPrice
}) => {
    let btnColor = "white";
    if (btsBtnLoading) btnColor = "#D99962";
    return (
        <div className="settings">
            <SettingsInput className="minPrice" label="min" placeholder="price" value={minPrice} onChange={setMinPrice} />
            <SettingsInput className="maxPrice" label="max" placeholder="price" value={maxPrice} onChange={setMaxPrice} />
            <SettingsInput className="minPercent" label="min" placeholder="percent" value={minPercent} onChange={setMinPercent} />
            <SettingsInput className="maxPercent" label="max" placeholder="percent" value={maxPercent} onChange={setMaxPercent} />
            <div style={{ marginTop: 20, ...alignItems }}>
                <span style={{ color: "white", fontSize: "16px", ...alignItems }}>
                    BTS-AVG:
                    <span style={{ marginLeft: 20, ...alignItems }}>
                        <span style={{ marginRight: 10 }}>От</span>
                        <Input style={inputStyle} className="bts-input" type="number" value={btsSales} onChange={e => setBtsSales(e.target.value)} placeholder="sales" />
                        <span style={{ margin: "0px 10px 0px 10px" }}>продаж за последние</span> 
                        <Input style={inputStyle} className="bts-input" type="number" value={btsDays} onChange={e => setBtsDays(e.target.value)} placeholder="days" />
                        <span style={{ marginLeft: 10 }}>дней</span> 
                        <Icon className="update-icon" name='refresh' onClick={e => changeBtsAvg() } style={{ color: btnColor }}/>
                    </span>
                </span>
            </div>
            <SettingsTime time={time} style={{ top: '2px', flexDirection: "row", color: "white", width: "590px", justifyContent: "space-around" }} />
            <Statistic size="mini" inverted className="shownItemsLength">
                <span style={{ color: "white", display: "flex", justifyContent: "space-around" }} >
                    <span>Items: <span style={{ color: "#D99962" }}>{shownItemsLength}</span></span>
                    <span>UsdPrice: <span style={{ color: "#D99962" }}>{usdPrice}</span></span>
                </span>
            </Statistic>
        </div>
    );
};

export default Settings;
