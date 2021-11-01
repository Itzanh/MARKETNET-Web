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



class StatesModal extends Component {
    constructor({ state, findCountryByName, defaultValueNameCountry, addStates, updateStates, deleteStates }) {
        super();

        this.state = state;
        this.addStates = addStates;
        this.updateStates = updateStates;
        this.deleteStates = deleteStates;

        this.currentSelectedCountryId = this.state != null ? this.state.country : "";
        this.findCountryByName = findCountryByName;
        this.defaultValueNameCountry = defaultValueNameCountry;
        this.open = true;

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
        city.country = parseInt(this.currentSelectedCountryId);
        city.name = this.refs.name.value;
        city.isoCode = this.refs.isoCode.value;
        return city;
    }

    add() {
        const state = this.getStateFromForm();

        this.addStates(state).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const state = this.getStateFromForm();
        state.id = this.state.id;

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
                <label>{i18next.t('country')}</label>
                <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.state != null ? this.state.country : null}
                    defaultValueName={this.defaultValueNameCountry} valueChanged={(value) => {
                        this.currentSelectedCountryId = value;
                    }} />
                <div class="form-group">
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.state != null ? this.state.name : ''} />
                </div>
                <div class="form-group">
                    <label>{i18next.t('iso-code')}</label>
                    <input type="text" class="form-control" ref="isoCode" defaultValue={this.state != null ? this.state.isoCode : ''} />
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
