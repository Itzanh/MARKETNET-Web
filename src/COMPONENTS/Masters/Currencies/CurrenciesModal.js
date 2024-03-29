/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import i18next from 'i18next';

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

import { TextField } from "@material-ui/core";



class CurrenciesModal extends Component {
    constructor({ currency, addCurrency, updateCurrency, deleteCurrency }) {
        super();

        this.currency = currency;
        this.addCurrency = addCurrency;
        this.updateCurrency = updateCurrency;
        this.deleteCurrency = deleteCurrency;

        this.open = true;
        this.errorMessages = {};

        this.name = React.createRef();
        this.sign = React.createRef();
        this.isoCode = React.createRef();
        this.isoNum = React.createRef();
        this.change = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getCurrencyFromForm() {
        const currency = {};
        currency.name = this.name.current.value;
        currency.sign = this.sign.current.value;
        currency.isoCode = this.isoCode.current.value;
        currency.isoNum = parseInt(this.isoNum.current.value);
        currency.change = parseFloat(this.change.current.value);
        return currency;
    }

    isValid(currency) {
        this.errorMessages = {};
        if (currency.name.length === 0) {
            this.errorMessages['name'] = i18next.t('name-0');
            this.forceUpdate();
            return false;
        }
        if (currency.name.length > 150) {
            this.errorMessages['name'] = i18next.t('name-150');
            this.forceUpdate();
            return false;
        }
        if (currency.sign.length > 3) {
            this.errorMessages['sign'] = i18next.t('sign-3');
            this.forceUpdate();
            return false;
        }
        if (currency.isoCode.length > 3) {
            this.errorMessages['iso'] = i18next.t('iso-3');
            this.forceUpdate();
            return false;
        }
        if (currency.isoNum <= 0) {
            this.errorMessages['isoNum'] = i18next.t('iso-num-0');
            this.forceUpdate();
            return false;
        }
        if (currency.change <= 0) {
            this.errorMessages['change'] = i18next.t('change-0');
            this.forceUpdate();
            return false;
        }
        this.forceUpdate();
        return true;
    }

    add() {
        const currency = this.getCurrencyFromForm();
        if (!this.isValid(currency)) {
            return;
        }

        this.addCurrency(currency).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const currency = this.getCurrencyFromForm();
        if (!this.isValid(currency)) {
            return;
        }
        currency.id = this.currency.id;

        this.updateCurrency(currency).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteCurrency(this.currency.id).then((ok) => {
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('currency')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.currency != null ? this.currency.name : ''} inputProps={{ maxLength: 150 }}
                        error={this.errorMessages['name']} helperText={this.errorMessages['name']} />
                </div>
                <div class="form-row">
                    <div class="col">
                        <TextField label={i18next.t('sign')} variant="outlined" fullWidth size="small" inputRef={this.sign}
                            defaultValue={this.currency != null ? this.currency.sign : ''} inputProps={{ maxLength: 3 }}
                            error={this.errorMessages['sign']} helperText={this.errorMessages['sign']} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('iso-code')} variant="outlined" fullWidth size="small" inputRef={this.isoCode}
                            defaultValue={this.currency != null ? this.currency.isoCode : ''} inputProps={{ maxLength: 3 }}
                            error={this.errorMessages['iso']} helperText={this.errorMessages['iso']} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('numeric-iso-code')} variant="outlined" fullWidth size="small" inputRef={this.isoNum} type="number"
                            defaultValue={this.currency != null ? this.currency.isoNum : '0'} InputProps={{ inputProps: { min: 0 } }}
                            error={this.errorMessages['isoNum']} helperText={this.errorMessages['isoNum']} />
                    </div>
                </div>
                <div class="form-row mt-3">
                    <div class="col">
                        <TextField label={i18next.t('change')} variant="outlined" fullWidth size="small" inputRef={this.change} type="number"
                            defaultValue={this.currency != null ? this.currency.change : '0'} InputProps={{ inputProps: { min: 0 } }}
                            error={this.errorMessages['change']} helperText={this.errorMessages['change']} />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                {this.currency != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.currency == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.currency != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default CurrenciesModal;
