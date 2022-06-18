import React, { Component } from 'react';
import i18next from 'i18next';
import AutocompleteField from '../../AutocompleteField';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";



class CountriesModal extends Component {
    constructor({ country, addCountry, updateCountry, deleteCountry, findLanguagesByName, findCurrencyByName }) {
        super();

        this.country = country;
        this.addCountry = addCountry;
        this.updateCountry = updateCountry;
        this.deleteCountry = deleteCountry;

        this.findLanguagesByName = findLanguagesByName;
        this.findCurrencyByName = findCurrencyByName;
        this.currentSelectedLangId = country != null ? country.languageId : null;
        this.currentSelectedCurrencyId = country != null ? country.currencyId : null;
        this.open = true;
        this.errorMessages = {};

        this.name = React.createRef();
        this.iso2 = React.createRef();
        this.iso3 = React.createRef();
        this.unCode = React.createRef();
        this.phonePrefix = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getCountryFromForm() {
        const country = {}
        country.name = this.name.current.value;
        country.iso2 = this.iso2.current.value;
        country.iso3 = this.iso3.current.value;
        country.unCode = parseInt(this.unCode.current.value);
        country.zone = document.getElementById("zone").value;
        country.phonePrefix = parseInt(this.phonePrefix.current.value);
        country.languageId = this.currentSelectedLangId != null ? parseInt(this.currentSelectedLangId) : null;
        country.currencyId = this.currentSelectedCurrencyId != null ? parseInt(this.currentSelectedCurrencyId) : null;
        return country;
    }

    isValid(country) {
        this.errorMessages = {};
        if (country.name.length === 0) {
            this.errorMessages['name'] = i18next.t('name-0');
            this.forceUpdate();
            return false;
        }
        if (country.name.length > 75) {
            this.errorMessages['name'] = i18next.t('name-75');
            this.forceUpdate();
            return false;
        }
        if (country.iso2.length !== 2) {
            this.errorMessages['iso2'] = i18next.t('iso-2');
            this.forceUpdate();
            return false;
        }
        if (country.iso3.length !== 3) {
            this.errorMessages['iso3'] = i18next.t('iso-3');
            this.forceUpdate();
            return false;
        }
        if (country.unCode <= 0) {
            this.errorMessages['unCode'] = i18next.t('valid-un-code');
            this.forceUpdate();
            return false;
        }
        this.forceUpdate();
        return true;
    }

    add() {
        const country = this.getCountryFromForm();
        if (!this.isValid(country)) {
            return;
        }

        this.addCountry(country).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const country = this.getCountryFromForm();
        country.id = this.country.id;
        if (!this.isValid(country)) {
            return;
        }

        this.updateCountry(country).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        const countryId = this.country.id;
        this.deleteCountry(countryId).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    DialogTitle = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('country')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.country != null ? this.country.name : ''} inputProps={{ maxLength: 75 }}
                        error={this.errorMessages['name']} helperText={this.errorMessages['name']} />
                </div>
                <div class="form-row">
                    <div class="col">
                        <TextField label='ISO 2' variant="outlined" fullWidth size="small" inputRef={this.iso2}
                            defaultValue={this.country != null ? this.country.iso2 : ''} inputProps={{ maxLength: 2 }}
                            error={this.errorMessages['iso2']} helperText={this.errorMessages['iso2']} />
                    </div>
                    <div class="col">
                        <TextField label='ISO 3' variant="outlined" fullWidth size="small" inputRef={this.iso3}
                            defaultValue={this.country != null ? this.country.iso3 : ''} inputProps={{ maxLength: 3 }}
                            error={this.errorMessages['iso3']} helperText={this.errorMessages['iso3']} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('un-code')} variant="outlined" fullWidth size="small" inputRef={this.unCode} type="number"
                            defaultValue={this.country != null ? this.country.unCode : '0'} InputProps={{ inputProps: { min: 0 } }}
                            error={this.errorMessages['unCode']} helperText={this.errorMessages['unCode']} />
                    </div>
                </div>
                <div class="form-row mt-3">
                    <div class="col">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('zone')}</InputLabel>
                            <NativeSelect
                                style={{ 'marginTop': '0' }}
                                id="zone">
                                <option value="N">{i18next.t('national')}</option>
                                <option value="U">{i18next.t('european-union')}</option>
                                <option value="E">{i18next.t('export')}</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('phone-prefix')} variant="outlined" fullWidth size="small" inputRef={this.phonePrefix} type="number"
                            defaultValue={this.country != null ? this.country.phonePrefix : '0'} />
                    </div>
                </div>
                <br />
                <div class="form-group">
                    <AutocompleteField findByName={this.findLanguagesByName} defaultValueId={this.country != null ? this.country.languageId : null}
                        defaultValueName={this.country != null && this.country.language != null ? this.country.language.name : ''} valueChanged={(value) => {
                            this.currentSelectedLangId = value;
                            if (value == "") {
                                this.currentSelectedLangId = null;
                            }
                        }}
                        label={i18next.t('language')} />
                </div>
                <div class="form-group">
                    <AutocompleteField findByName={this.findCurrencyByName} defaultValueId={this.country != null ? this.country.currencyId : null}
                        defaultValueName={this.country != null && this.country.currency != null ? this.country.currency.name : ''} valueChanged={(value) => {
                            this.currentSelectedCurrencyId = value;
                            if (value == "") {
                                this.currentSelectedCurrencyId = null;
                            }
                        }}
                        label={i18next.t('currency')} />
                </div>
                <div class="form-row">
                    <div class="col">
                    </div>
                    <div class="col">
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                {this.country != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.country == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.country != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default CountriesModal;
