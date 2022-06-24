/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
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
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

const accountingMovementType = {
    "O": "opening",
    "N": "normal",
    "V": "variation of existences",
    "R": "regularisation",
    "C": "closing"
}



class AccountingMovementDetails extends Component {
    constructor({ movementId, getAccountingMovementDetail, insertAccountingMovementDetail, deleteAccountingMovementDetail, getPaymentMethod,
        getRegisterTransactionalLogs, getAccounts }) {
        super();

        this.movementId = movementId;
        this.getAccountingMovementDetail = getAccountingMovementDetail;
        this.insertAccountingMovementDetail = insertAccountingMovementDetail;
        this.deleteAccountingMovementDetail = deleteAccountingMovementDetail;
        this.getPaymentMethod = getPaymentMethod;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getAccounts = getAccounts;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.printDetails();   
    }

    printDetails() {
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
                            this.printDetails();
                        }
                    });
                    return promise;
                }}
                getPaymentMethod={this.getPaymentMethod}
                getAccounts={this.getAccounts}
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
                            this.printDetails();
                        }
                    });
                    return promise;
                }}
                getPaymentMethod={this.getPaymentMethod}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getAccounts={this.getAccounts}
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
            <button type="button" class="btn btn-primary mt-1 mb-2 ml-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: '', headerName: i18next.t('account'), width: 150, valueGetter: (params) => {
                            return params.row.journal.id + "." + this.padLeadingZeros(params.row.account.accountNumber, 6)
                        }
                    },
                    {
                        field: 'accountName', headerName: i18next.t('account-name'), flex: 1, valueGetter: (params) => {
                            return params.row.account.name;
                        }
                    },
                    {
                        field: 'type', headerName: i18next.t('type'), width: 300, valueGetter: (params) => {
                            return i18next.t(accountingMovementType[params.row.type])
                        }
                    },
                    { field: 'documentName', headerName: i18next.t('document'), width: 200 },
                    {
                        field: 'paymentMethodName', headerName: i18next.t('payment-method'), width: 250, valueGetter: (params) => {
                            return params.row.paymentMethod.name;
                        }
                    },
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
    constructor({ detail, movementId, insertAccountingMovementDetail, deleteAccountingMovementDetail, getPaymentMethod, getRegisterTransactionalLogs,
        getAccounts }) {
        super();

        this.detail = detail;
        this.movementId = movementId;
        this.insertAccountingMovementDetail = insertAccountingMovementDetail;
        this.deleteAccountingMovementDetail = deleteAccountingMovementDetail;
        this.getPaymentMethod = getPaymentMethod;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getAccounts = getAccounts;

        this.open = true;

        this.credit = React.createRef();
        this.debit = React.createRef();
        this.notes = React.createRef();
        this.documentName = React.createRef();

        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderPaymentMethods = this.renderPaymentMethods.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    componentDidMount() {
        setTimeout(async () => {
            await this.renderPaymentMethods();
            this.renderAccount();
        }, 10);
    }

    renderPaymentMethods() {
        return new Promise((resolve) => {
            if (this.detail == null) {
                this.getPaymentMethod().then((paymentMethods) => {
                    ReactDOM.render(paymentMethods.map((element, i) => {
                        return <option key={i} value={element.id}>{element.name}</option>
                    }), document.getElementById("paymentMethod"));
                    resolve();
                });
            } else {
                ReactDOM.render(
                    <option>{this.detail.paymentMethod.name}</option>
                    , document.getElementById("paymentMethod"));
                resolve();
            }
        });
    }

    renderAccount() {
        if (this.detail == null) {
            this.getAccounts().then((accounts) => {
                ReactDOM.render(accounts.map((element, i) => {
                    return <option value={element.journalId + "," + element.accountNumber} key={i}>{element.accountName + " - " + element.name}</option>
                }), document.getElementById("account"));
            });
        } else {
            ReactDOM.render(
                <option value={this.detail.accountId} key={0}>{this.detail.account.accountName + " - " + this.detail.account.name}</option>,
                document.getElementById("account"));
            document.getElementById("account").disabled = true;
        }
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getAccountingMovementDetailFromForm() {
        const detail = {};
        detail.movementId = this.movementId;
        const accountData = document.getElementById("account").value.split(",");
        detail.journalId = parseInt(accountData[0]);
        detail.accountNumber = parseInt(accountData[1]);
        detail.credit = parseFloat(this.credit.current.value);
        detail.debit = parseFloat(this.debit.current.value);
        detail.type = document.getElementById("type").value;
        detail.note = this.notes.current.value;
        detail.documentName = this.documentName.current.value;
        detail.paymentMethodId = parseInt(document.getElementById("paymentMethod").value);
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

    transactionLog() {
        if (this.detail == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderModalDetail2'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"accounting_movement_detail"}
            registerId={this.detail.id}
        />,
            document.getElementById('renderModalDetail2'));
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('accounting-movement-detail')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <div class="form-row">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('account')}</InputLabel>
                            <NativeSelect
                                style={{ 'marginTop': '0' }}
                                id="account"
                                defaultValue={this.detail != undefined ? this.detail.accountId : '0'}
                            >

                            </NativeSelect>
                        </FormControl>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('credit')} variant="outlined" fullWidth size="small" inputRef={this.credit} type="number"
                                defaultValue={this.detail != undefined ? this.detail.credit : '0'} InputProps={{ readOnly: this.detail != undefined }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('debit')} variant="outlined" fullWidth size="small" inputRef={this.debit} type="number"
                                defaultValue={this.detail != undefined ? this.detail.debit : '0'} InputProps={{ readOnly: this.detail != undefined }} />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('type')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="type"
                            defaultValue={this.detail != undefined ? this.detail.type : 'N'}
                            disabled={this.detail != undefined}
                        >
                            <option value="O">{i18next.t('opening')}</option>
                            <option value="N">{i18next.t('normal')}</option>
                            <option value="V">{i18next.t('variation-of-existences')}</option>
                            <option value="R">{i18next.t('regularisation')}</option>
                            <option value="C">{i18next.t('closing')}</option>
                        </NativeSelect>
                    </FormControl>
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('notes')} variant="outlined" fullWidth size="small" inputRef={this.notes}
                        defaultValue={this.detail != undefined ? this.detail.note : ''} inputProps={{ maxLength: 300 }}
                        InputProps={{ readOnly: this.detail != undefined }} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('document-name')} variant="outlined" fullWidth size="small" inputRef={this.documentName}
                        defaultValue={this.detail != undefined ? this.detail.documentName : ''} inputProps={{ maxLength: 15 }}
                        InputProps={{ readOnly: this.detail != undefined }} />
                </div>
                <div class="form-group">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('payment-method')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="paymentMethod"
                            disabled={this.detail != undefined}>

                        </NativeSelect>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <div class="btn-group dropup">
                    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('options')}
                    </button>
                    <div class="dropdown-menu">
                        {this.detail != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                    </div>
                </div>

                {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default AccountingMovementDetails;
