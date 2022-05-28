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

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";



class BillingSerieModal extends Component {
    constructor({ serie, addBillingSerie, updateBillingSerie, deleteBillingSerie }) {
        super();

        this.serie = serie;
        this.addBillingSerie = addBillingSerie;
        this.updateBillingSerie = updateBillingSerie;
        this.deleteBillingSerie = deleteBillingSerie;

        this.open = true;

        this.id = React.createRef();
        this.name = React.createRef();
        this.year = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getSerieFromForm() {
        const serie = {}
        serie.id = this.id.current.value;
        serie.name = this.name.current.value;
        serie.billingType = document.getElementById("type").value;
        serie.year = parseInt(this.year.current.value);
        return serie;
    }

    isValid(serie) {
        this.refs.errorMessage.innerText = "";
        if (serie.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (serie.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (serie.id.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('id-0');
            return false;
        }
        if (serie.id.length > 3) {
            this.refs.errorMessage.innerText = i18next.t('id-3');
            return false;
        }
        return true;
    }

    add() {
        const serie = this.getSerieFromForm();
        if (!this.isValid(serie)) {
            return;
        }

        this.addBillingSerie(serie).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const serie = this.getSerieFromForm();
        if (!this.isValid(serie)) {
            return;
        }

        this.updateBillingSerie(serie).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        const serieId = this.id.current.value;
        this.deleteBillingSerie(serieId).then((ok) => {
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
                {i18next.t('billing-serie')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <TextField label='ID' variant="outlined" fullWidth size="small" inputRef={this.id}
                        defaultValue={this.serie != null ? this.serie.id : ''} InputProps={{ readOnly: this.serie != null }}
                        inputProps={{ maxLength: 3 }} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.serie != null ? this.serie.name : ''} inputProps={{ maxLength: 50 }} />
                </div>
                <div class="form-row">
                    <div class="col">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('billing-type')}</InputLabel>
                            <NativeSelect
                                style={{ 'marginTop': '0' }}
                                id="type"
                                defaultValue={this.serie != null ? this.serie.billingType : 'S'}>
                                <option value="S">{i18next.t('sales')}</option>
                                <option value="P">{i18next.t('purchases')}</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <TextField label={i18next.t('year')} variant="outlined" fullWidth size="small" inputRef={this.year} type="number"
                                defaultValue={this.serie != null ? this.serie.year : new Date().getYear() + 1900}
                                InputProps={{ readOnly: this.serie != null, inputProps: { min: 1970 } }} />
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.serie != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.serie == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.serie != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default BillingSerieModal;
