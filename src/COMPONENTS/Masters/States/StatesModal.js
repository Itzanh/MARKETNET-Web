/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

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

import { TextField } from "@material-ui/core";



class StatesModal extends Component {
    constructor({ state, findCountryByName, addStates, updateStates, deleteStates }) {
        super();

        this.state = state;
        this.addStates = addStates;
        this.updateStates = updateStates;
        this.deleteStates = deleteStates;

        this.currentSelectedCountryId = this.state != null ? this.state.countryId : null;
        this.findCountryByName = findCountryByName;

        this.open = true;
        this.errorMessages = {};

        this.name = React.createRef();
        this.isoCode = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getStateFromForm() {
        const city = {}
        city.countryId = parseInt(this.currentSelectedCountryId);
        city.name = this.name.current.value;
        city.isoCode = this.isoCode.current.value;
        return city;
    }

    isValid(state) {
        this.errorMessages = {};
        if (state.name.length === 0) {
            this.errorMessages['name'] = i18next.t('name-0');
            this.forceUpdate();
            return false;
        }
        this.forceUpdate();
        return true;
    }

    add() {
        const state = this.getStateFromForm();
        if (!this.isValid(state)) {
            return;
        }

        this.addStates(state).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const state = this.getStateFromForm();
        state.id = this.state.id;
        if (!this.isValid(state)) {
            return;
        }

        this.updateStates(state).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        const stateId = this.state.id;
        this.deleteStates(stateId).then((ok) => {
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
                {i18next.t('state')}
            </this.DialogTitle>
            <DialogContent>
                <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.state != null ? this.state.country.id : null}
                    defaultValueName={this.state != null ? this.state.country.name : null} valueChanged={(value) => {
                        this.currentSelectedCountryId = value;
                    }}
                    label={i18next.t('country')} />
                <div class="form-group mt-3">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.state != null ? this.state.name : ''} inputProps={{ maxLength: 100 }}
                        error={this.errorMessages['name']} helperText={this.errorMessages['name']} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('iso-code')} variant="outlined" fullWidth size="small" inputRef={this.isoCode}
                        defaultValue={this.state != null ? this.state.isoCode : ''} inputProps={{ maxLength: 7 }} />
                </div>
            </DialogContent>
            <DialogActions>
                {this.state != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.state == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.state != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default StatesModal;
