import React, { Component } from "react";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';



class AutocompleteField extends Component {
    constructor({ findByName, defaultValueId, defaultValueName, valueChanged, disabled, label }) {
        super();

        this.findByName = findByName;
        this.valueChanged = valueChanged;
        this.disabled = disabled;
        this.label = label;

        this.currentSelectedId = defaultValueId != null ? defaultValueId : "";
        this.defaultValueName = defaultValueName != null ? defaultValueName : "";

        this.state = {
            values: [],
            open: false,
        };

    }

    async showAllValues() {
        const values = await this.findByName(this.defaultValueName);

        this.setState({
            values: values,
        });
    }

    render() {
        return <form autoComplete="off">
            <Autocomplete
                disablePortal
                options={this.state.values}
                fullWidth
                renderInput={(params) => <TextField {...params} label={this.label} onChange={async (e) => {
                    const values = await this.findByName(e.target.value.toUpperCase());

                    this.setState({
                        values: values,
                    });
                }} />}
                readOnly={this.disabled}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => {
                    if (this.valueChanged != null) {
                        if (value != null) {
                            this.valueChanged(value.id);
                        } else {
                            this.showAllValues();
                            this.valueChanged("");
                        }
                    }
                }}
                onOpen={() => {
                    this.setState({
                        open: true,
                    });
                    this.showAllValues();
                }}
                onClose={() => {
                    this.setState({
                        open: false,
                    });
                }}
                defaultValue={{
                    id: this.currentSelectedId,
                    name: this.defaultValueName
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
            />
        </form>
    }
};





export default AutocompleteField;
