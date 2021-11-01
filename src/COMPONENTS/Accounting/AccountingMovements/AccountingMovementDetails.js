import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

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

const accountingMovementType = {
    "O": "opening",
    "N": "normal",
    "V": "variation of existences",
    "R": "regularisation",
    "C": "closing"
}



class AccountingMovementDetails extends Component {
    constructor({ movementId, getAccountingMovementDetail, insertAccountingMovementDetail, deleteAccountingMovementDetail, getPaymentMethod }) {
        super();

        this.movementId = movementId;
        this.getAccountingMovementDetail = getAccountingMovementDetail;
        this.insertAccountingMovementDetail = insertAccountingMovementDetail;
        this.deleteAccountingMovementDetail = deleteAccountingMovementDetail;
        this.getPaymentMethod = getPaymentMethod;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getAccountingMovementDetail(this.movementId).then((details) => {
            this.renderDetails(details);
        });
    }

    renderDetails(details) {
        this.list = details;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(
            <AccountingMovementDetailModal
                movementId={this.movementId}
                insertAccountingMovementDetail={(detail) => {
                    const promise = this.insertAccountingMovementDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDetails();
                        }
                    });
                    return promise;
                }}
                getPaymentMethod={this.getPaymentMethod}
            />,
            this.refs.renderModal);
    }

    edit(detail) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(
            <AccountingMovementDetailModal
                movementId={this.movementId}
                detail={detail}
                deleteAccountingMovementDetail={(detailId) => {
                    const promise = this.deleteAccountingMovementDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDetails();
                        }
                    });
                    return promise;
                }}
                getPaymentMethod={this.getPaymentMethod}
            />,
            this.refs.renderModal);
    }

    padLeadingZeros(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    render() {
        return <div>
            <div ref="renderModal"></div>
            <button type="button" class="btn btn-primary mt-1 mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    {
                        field: '', headerName: i18next.t('account'), width: 150, valueGetter: (params) => {
                            return params.row.journal + "." + this.padLeadingZeros(params.row.accountNumber, 6)
                        }
                    },
                    { field: 'accountName', headerName: i18next.t('account-name'), flex: 1 },
                    {
                        field: 'type', headerName: i18next.t('type'), width: 300, valueGetter: (params) => {
                            return i18next.t(accountingMovementType[params.row.type])
                        }
                    },
                    { field: 'documentName', headerName: i18next.t('document'), width: 200 },
                    { field: 'paymentMethodName', headerName: i18next.t('payment-method'), width: 250 },
                    { field: 'debit', headerName: i18next.t('debit'), width: 200 },
                    { field: 'credit', headerName: i18next.t('credit'), width: 200 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class AccountingMovementDetailModal extends Component {
    constructor({ detail, movementId, insertAccountingMovementDetail, deleteAccountingMovementDetail, getPaymentMethod }) {
        super();

        this.detail = detail;
        this.movementId = movementId;
        this.insertAccountingMovementDetail = insertAccountingMovementDetail;
        this.deleteAccountingMovementDetail = deleteAccountingMovementDetail;
        this.getPaymentMethod = getPaymentMethod;
        this.open = true;

        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderPaymentMethods = this.renderPaymentMethods.bind(this);
    }

    componentDidMount() {
        setTimeout(this.renderPaymentMethods, 10);
    }

    renderPaymentMethods() {
        if (this.detail == null) {
            this.getPaymentMethod().then((paymentMethods) => {
                ReactDOM.render(paymentMethods.map((element, i) => {
                    return <option key={i} value={element.id}>{element.name}</option>
                }), this.refs.paymentMethod);
            });
        } else {
            ReactDOM.render(
                <option>{this.detail.paymentMethodName}</option>
                , this.refs.paymentMethod);
        }
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getAccountingMovementDetailFromForm() {
        const detail = {};
        detail.movement = this.movementId;
        detail.journal = parseInt(this.refs.journal.value);
        detail.accountNumber = parseInt(this.refs.account.value);
        detail.credit = parseFloat(this.refs.credit.value);
        detail.debit = parseFloat(this.refs.debit.value);
        detail.type = this.refs.type.value;
        detail.note = this.refs.note.value;
        detail.documentName = this.refs.documentName.value;
        detail.paymentMethod = parseInt(this.refs.paymentMethod.value);
        return detail;
    }

    add() {
        const detail = this.getAccountingMovementDetailFromForm();

        this.insertAccountingMovementDetail(detail).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteAccountingMovementDetail(this.detail.id).then((ok) => {
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
                {i18next.t('accounting-movement-detail')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-row">
                    <div class="col">
                        <label>{i18next.t('journal')}</label>
                        <input type="number" class="form-control" defaultValue={this.detail != undefined ? this.detail.journal : '0'} ref="journal" />
                    </div>
                    <div class="col">
                        <label>{i18next.t('account')}</label>
                        <input type="number" class="form-control" defaultValue={this.detail != undefined ? this.detail.account : '0'} ref="account" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="col">
                        <label>{i18next.t('credit')}</label>
                        <input type="number" class="form-control" defaultValue={this.detail != undefined ? this.detail.credit : '0'} ref="credit" />
                    </div>
                    <div class="col">
                        <label>{i18next.t('debit')}</label>
                        <input type="number" class="form-control" defaultValue={this.detail != undefined ? this.detail.debit : '0'} ref="debit" />
                    </div>
                </div>
                <label>{i18next.t('type')}</label>
                <select class="form-control" defaultValue={this.detail != undefined ? this.detail.type : 'N'} ref="type">
                    <option value="O">{i18next.t('opening')}</option>
                    <option value="N">{i18next.t('normal')}</option>
                    <option value="V">{i18next.t('variation-of-existences')}</option>
                    <option value="R">{i18next.t('regularisation')}</option>
                    <option value="C">{i18next.t('closing')}</option>
                </select>
                <label>{i18next.t('notes')}</label>
                <input type="text" class="form-control" defaultValue={this.detail != undefined ? this.detail.note : ''} ref="note" />
                <label>{i18next.t('document-name')}</label>
                <input type="text" class="form-control" defaultValue={this.detail != undefined ? this.detail.documentName : ''} ref="documentName" />
                <label>{i18next.t('payment-method')}</label>
                <select class="form-control" ref="paymentMethod" disabled={this.detail != undefined}>
                </select>
            </DialogContent>
            <DialogActions>
                {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default AccountingMovementDetails;
