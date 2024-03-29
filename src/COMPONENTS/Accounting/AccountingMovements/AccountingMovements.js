/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import SearchField from "../../SearchField";
import AccountingMovementForm from "./AccountingMovementForm";

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

import { FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

const accountingMovementType = {
    "O": "opening",
    "N": "normal",
    "V": "variation-of-existences",
    "R": "regularisation",
    "C": "closing"
}



class AccountingMovements extends Component {
    constructor({ getAccountingMovement, searchAccountingMovements, insertAccountingMovement, deleteAccountingMovement, getBillingSeries,
        getAccountingMovementDetail, insertAccountingMovementDetail, deleteAccountingMovementDetail, tabAccountingMovements, getAccountingMovementSaleInvoices,
        getAccountingMovementPurchaseInvoices, getPaymentMethod, getColletionOperations, insertCharges, getCharges, deleteCharges, getPaymentTransactions,
        insertPayment, getPayments, deletePayment, getRegisterTransactionalLogs, getSalesInvoicesFuntions, getPurcaseInvoicesFunctions,
        getAccounts }) {
        super();

        this.getAccountingMovement = getAccountingMovement;
        this.searchAccountingMovements = searchAccountingMovements;
        this.insertAccountingMovement = insertAccountingMovement;
        this.deleteAccountingMovement = deleteAccountingMovement;
        this.getBillingSeries = getBillingSeries;

        this.getAccountingMovementDetail = getAccountingMovementDetail;
        this.insertAccountingMovementDetail = insertAccountingMovementDetail;
        this.deleteAccountingMovementDetail = deleteAccountingMovementDetail;
        this.tabAccountingMovements = tabAccountingMovements;
        this.getAccountingMovementSaleInvoices = getAccountingMovementSaleInvoices;
        this.getAccountingMovementPurchaseInvoices = getAccountingMovementPurchaseInvoices;
        this.getPaymentMethod = getPaymentMethod;
        this.getColletionOperations = getColletionOperations;
        this.insertCharges = insertCharges;
        this.getCharges = getCharges;
        this.deleteCharges = deleteCharges;

        this.getPaymentTransactions = getPaymentTransactions;
        this.insertPayment = insertPayment;
        this.getPayments = getPayments;
        this.deletePayment = deletePayment;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.getSalesInvoicesFuntions = getSalesInvoicesFuntions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;
        this.getAccounts = getAccounts;

        this.list = [];
        this.advancedSearchListener = null;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.getAccountingMovement().then((movements) => {
            this.renderMovements(movements);
        });
    }

    async search(searchText) {
        const search = {};
        search.search = searchText;

        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            search.dateStart = s.dateStart;
            search.dateEnd = s.dateEnd;
            search.type = s.type;
            search.billingSerieId = s.billingSerieId;
        }

        const movements = await this.searchAccountingMovements(search);
        this.renderMovements(movements);
        this.list = movements;
    }

    renderMovements(movements) {
        this.list = movements;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAccountingMovementsModal'));
        ReactDOM.render(
            <AccountingMovementModal
                insertAccountingMovement={(carrier) => {
                    const promise = this.insertAccountingMovement(carrier);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAccountingMovement().then((movements) => {
                                this.renderMovements(movements);
                            });
                        }
                    });
                    return promise;
                }}
                getBillingSeries={this.getBillingSeries}
            />,
            document.getElementById('renderAccountingMovementsModal'));
    }

    edit(movement) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <AccountingMovementForm
                movement={movement}
                deleteAccountingMovement={this.deleteAccountingMovement}

                getAccountingMovementDetail={this.getAccountingMovementDetail}
                insertAccountingMovementDetail={this.insertAccountingMovementDetail}
                deleteAccountingMovementDetail={this.deleteAccountingMovementDetail}
                tabAccountingMovements={this.tabAccountingMovements}
                getAccountingMovementSaleInvoices={this.getAccountingMovementSaleInvoices}
                getAccountingMovementPurchaseInvoices={this.getAccountingMovementPurchaseInvoices}
                getPaymentMethod={this.getPaymentMethod}
                getColletionOperations={this.getColletionOperations}
                insertCharges={this.insertCharges}
                getCharges={this.getCharges}
                deleteCharges={this.deleteCharges}

                getPaymentTransactions={this.getPaymentTransactions}
                insertPayment={this.insertPayment}
                getPayments={this.getPayments}
                deletePayment={this.deletePayment}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}

                getSalesInvoicesFuntions={this.getSalesInvoicesFuntions}
                getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
                getAccounts={this.getAccounts}
            />,
            document.getElementById('renderTab'));
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <AccountingMovementsAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                    getBillingSeries={this.getBillingSeries}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabAccountingMovements" className="formRowRoot">
            <div id="renderAccountingMovementsModal"></div>
            <h4 className="ml-2">{i18next.t('accounting-movements')}</h4>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 200, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    {
                        field: 'type', headerName: i18next.t('type'), width: 200, valueGetter: (params) => {
                            return i18next.t(accountingMovementType[params.row.type])
                        }
                    },
                    {
                        field: 'billingSerieName', headerName: i18next.t('billing-serie'), flex: 1, valueGetter: (params) => {
                            return params.row.billingSerie.name;
                        }
                    },
                    { field: 'amountDebit', headerName: i18next.t('amount-debit'), width: 300 },
                    { field: 'amountCredit', headerName: i18next.t('amount-credit'), width: 300 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class AccountingMovementModal extends Component {
    constructor({ insertAccountingMovement, getBillingSeries }) {
        super();

        this.insertAccountingMovement = insertAccountingMovement;
        this.getBillingSeries = getBillingSeries;

        this.open = true;

        this.add = this.add.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.renderBillingSeries();
    }

    async renderBillingSeries() {
        const series = await this.getBillingSeries();
        ReactDOM.render(series.map((element, i) => {
            return <option key={i} value={element.id}>{element.name}</option>
        }), document.getElementById("billingSerie"));
    }

    add() {
        const movement = {
            type: document.getElementById("type").value,
            billingSerieId: document.getElementById("billingSerie").value
        };
        this.insertAccountingMovement(movement).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
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

    DialogTitleProduct = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => {
                    ReactDOM.unmountComponentAtNode(this.refs.render);
                }}>
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
                {i18next.t('accounting-movement')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('type')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="type"
                            defaultValue="N">
                            <option value="O">{i18next.t('opening')}</option>
                            <option value="N">{i18next.t('normal')}</option>
                            <option value="V">{i18next.t('variation-of-existences')}</option>
                            <option value="R">{i18next.t('regularisation')}</option>
                            <option value="C">{i18next.t('closing')}</option>
                        </NativeSelect>
                    </FormControl>
                </div>
                <div class="form-group">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('billing-serie')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="billingSerie">

                        </NativeSelect>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </DialogActions>
        </Dialog>
    }

}

class AccountingMovementsAdvancedSearch extends Component {
    constructor({ subscribe, getBillingSeries }) {
        super();

        this.getBillingSeries = getBillingSeries;

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    getFormData() {
        const search = {};
        if (this.refs.start.value !== "") {
            search.dateStart = new Date(this.refs.start.value);
        }
        if (this.refs.end.value !== "") {
            search.dateEnd = new Date(this.refs.end.value);
        }
        if (document.getElementById("type").value != "") {
            search.type = document.getElementById("type").value;
        }
        if (document.getElementById("billingSerie").value != "") {
            search.billingSerieId = document.getElementById("billingSerie").value;
        }
        return search;
    }

    componentDidMount() {
        this.renderBillingSeries();
    }

    async renderBillingSeries() {
        const series = await this.getBillingSeries();
        series.unshift({
            id: "",
            name: "." + i18next.t('none')
        });
        ReactDOM.render(series.map((element, i) => {
            return <option key={i} value={element.id}>{element.name}</option>
        }), document.getElementById("billingSerie"));
    }

    render() {
        return <div class="form-row">
            <div class="col">
                <label for="start">{i18next.t('start-date')}:</label>
                <br />
                <input type="date" class="form-control" ref="start" />
            </div>
            <div class="col">
                <label for="start">{i18next.t('end-date')}:</label>
                <br />
                <input type="date" class="form-control" ref="end" />
            </div>
            <div class="col">
                <FormControl fullWidth>
                    <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('type')}</InputLabel>
                    <NativeSelect
                        style={{ 'marginTop': '0' }}
                        id="type"
                        defaultValue="">
                        <option value="">.{i18next.t('none')}</option>
                        <option value="O">{i18next.t('opening')}</option>
                        <option value="N">{i18next.t('normal')}</option>
                        <option value="V">{i18next.t('variation-of-existences')}</option>
                        <option value="R">{i18next.t('regularisation')}</option>
                        <option value="C">{i18next.t('closing')}</option>
                    </NativeSelect>
                </FormControl>
            </div>
            <div class="col">
                <FormControl fullWidth>
                    <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('billing-serie')}</InputLabel>
                    <NativeSelect
                        style={{ 'marginTop': '0' }}
                        id="billingSerie">

                    </NativeSelect>
                </FormControl>
            </div>
        </div>
    }
}



export default AccountingMovements;
