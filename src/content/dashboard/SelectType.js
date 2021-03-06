import React, { Component } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

class SelectType extends Component {

  render() {
    return (
      <Autocomplete
        options={dataType}
        renderInput={(params) => <TextField {...params} label="Type" />}
      />
    );
  }
}

const dataType = [
  { label: 'Land' },
  { label: 'Building' },
  { label: 'Equipment' },
  { label: 'Vehicle (4 Wheels)' },
  { label: 'Vehicle (2 Wheels)' },
  { label: 'Computers' },
  { label: 'Furniture Fixture' },
  { label: 'Tools' },
  { label: 'Intangible Asset' },
  { label: 'Construction' }
];


export default SelectType
