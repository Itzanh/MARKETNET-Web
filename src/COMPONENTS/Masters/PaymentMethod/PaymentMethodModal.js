import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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



class PaymentMethodModal extends Component {
    constructor({ paymentMethod, addPaymentMehod, updatePaymentMethod, deletePaymentMethod, locateAccountForBanks }) {
        super();

        this.paymentMethod = paymentMethod;
        this.addPaymentMehod = addPaymentMehod;
        this.updatePaymentMethod = updatePaymentMethod;
        this.deletePaymentMethod = deletePaymentMethod;
        this.locateAccountForBanks = locateAccountForBanks;

        this.open = true;

        this.name = React.createRef();
        this.prestashopModuleName = React.createRef();
        this.wooCommerceModuleName = React.createRef();
        this.shopifyModuleName = React.createRef();
        this.daysExpiration = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.renderAccounts();
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    renderAccounts() {
        this.locateAccountForBanks().then(async (accounts) => {
            const options = accounts.map((element, i) => {
                return <option key={i} value={element.id}>{element.name}</option>
            });
            options.unshift(<option key={0} value="">.{i18next.t('none')}</option>);

            await ReactDOM.render(options, document.getElementById("bank"));
            document.getElementById("bank").value = this.paymentMethod != null ? (this.paymentMethod.bank != null ? this.paymentMethod.bank : '') : '';
        });
    }

    getPaymentMethodFromForm() {
        const paymentMethod = {};
        paymentMethod.name = this.name.current.value;
        paymentMethod.paidInAdvance = this.refs.paidInAdvance.checked;
        paymentMethod.prestashopModuleName = this.prestashopModuleName.current.value;
        paymentMethod.wooCommerceModuleName = this.wooCommerceModuleName.current.value;
        paymentMethod.shopifyModuleName = this.shopifyModuleName.current.value;
        paymentMethod.daysExpiration = parseInt(this.daysExpiration.current.value);
        paymentMethod.bank = document.getElementById("bank").value == "" ? null : parseInt(document.getElementById("bank").value);
        return paymentMethod;
    }

    isValid(paymentMethod) {
        this.refs.errorMessage.innerText = "";
        if (paymentMethod.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (paymentMethod.name.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('name-100');
            return false;
        }
        return true;
    }

    add() {
        const paymentMethod = this.getPaymentMethodFromForm();
        if (!this.isValid(paymentMethod)) {
            return;
        }

        this.addPaymentMehod(paymentMethod).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const paymentMethod = this.getPaymentMethodFromForm();
        if (!this.isValid(paymentMethod)) {
            return;
        }
        paymentMethod.id = this.paymentMethod.id;

        this.updatePaymentMethod(paymentMethod).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deletePaymentMethod(this.paymentMethod.id).then((ok) => {
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
                {i18next.t('payment-method')}
            </this.DialogTitle>
            <DialogContent>
                <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                    defaultValue={this.paymentMethod != null ? this.paymentMethod.name : ''} />
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" ref="paidInAdvance" id="paidInAdvance"
                        defaultChecked={this.paymentMethod && this.paymentMethod.paidInAdvance} />
                    <label class="custom-control-label" htmlFor="paidInAdvance">{i18next.t('paid-in-advance')}</label>
                </div>
                <br />
                <br />
                <TextField label={i18next.t('prestashop-module-name')} variant="outlined" fullWidth size="small" inputRef={this.prestashopModuleName}
                    defaultValue={this.paymentMethod != null ? this.paymentMethod.prestashopModuleName : ''} />
                <br />
                <br />
                <TextField label={i18next.t('woocommerce-module-name')} variant="outlined" fullWidth size="small" inputRef={this.wooCommerceModuleName}
                    defaultValue={this.paymentMethod != null ? this.paymentMethod.wooCommerceModuleName : ''} />
                <br />
                <br />
                <TextField label={i18next.t('shopify-module-name')} variant="outlined" fullWidth size="small" inputRef={this.shopifyModuleName}
                    defaultValue={this.paymentMethod != null ? this.paymentMethod.shopifyModuleName : ''} />
                <br />
                <br />
                <TextField label={i18next.t('days-expiration')} variant="outlined" fullWidth size="small" inputRef={this.daysExpiration} type="number"
                    defaultValue={this.paymentMethod != null ? this.paymentMethod.daysExpiration : '0'} />
                <br />
                <br />
                <FormControl fullWidth>
                    <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('account')}</InputLabel>
                    <NativeSelect
                        style={{ 'marginTop': '0' }}
                        id="bank">

                    </NativeSelect>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.paymentMethod != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                {this.paymentMethod == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.paymentMethod != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default PaymentMethodModal;
