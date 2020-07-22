import React from 'react';
import { Input, Label } from 'semantic-ui-react';

const SettingsInput = ({ value, onChange, label, className, placeholder, style }) => {
  return (
    <Input style={style} className={className} labelPosition="right" type="number" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}>
      <Label basic>{label}</Label>
      <input />
    </Input>
  );
};

export default SettingsInput;
