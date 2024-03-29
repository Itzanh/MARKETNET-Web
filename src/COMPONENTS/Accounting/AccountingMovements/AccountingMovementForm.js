/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import AccountingMovementDetails from "./AccountingMovementDetails";
import AccountingMovementSaleInvoices from "./AccountingMovementSaleInvoices";
import AccountingMovementPurchaseInvoices from "./AccountingMovementPurchaseInvoices";
import ConfirmDelete from "../../ConfirmDelete";
import AccountingMovementCharges from "./AccountingMovementCharges";
import AccountingMovementPayments from "./AccountingMovementPayments";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";



class AccountingMovementForm extends Component {
    constructor({ movement, deleteAccountingMovement, getAccountingMovementDetail, insertAccountingMovementDetail, deleteAccountingMovementDetail,
        tabAccountingMovements, getAccountingMovementSaleInvoices, getAccountingMovementPurchaseInvoices, getPaymentMethod, getColletionOperations,
        insertCharges, getCharges, deleteCharges, getPaymentTransactions, insertPayment, getPayments, deletePayment, getRegisterTransactionalLogs,
        getSalesInvoicesFuntions, getPurcaseInvoicesFunctions, getAccounts }) {
        super();

        this.movement = movement;
        this.deleteAccountingMovement = deleteAccountingMovement;
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

        this.tab = 0;

        this.tabDetais = this.tabDetais.bind(this);
        this.tabSaleInvoices = this.tabSaleInvoices.bind(this);
        this.tabPurchaseInvoices = this.tabPurchaseInvoices.bind(this);
        this.tabColletionOperations = this.tabColletionOperations.bind(this);
        this.tabPaymentTransactions = this.tabPaymentTransactions.bind(this);
        this.delete = this.delete.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    componentDidMount() {
        this.tabs();
        this.tabDetais();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabDetais();
                        break;
                    }
                    case 1: {
                        this.tabSaleInvoices();
                        break;
                    }
                    case 2: {
                        this.tabPurchaseInvoices();
                        break;
                    }
                    case 3: {
                        this.tabColletionOperations();
                        break;
                    }
                    case 4: {
                        this.tabPaymentTransactions();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('accounting-details')} />
                <Tab label={i18next.t('sale-invoices')} />
                <Tab label={i18next.t('purchase-invoices')} />
                <Tab label={i18next.t('charges')} />
                <Tab label={i18next.t('payments')} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    tabDetais() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<AccountingMovementDetails
            movementId={this.movement.id}
            getAccountingMovementDetail={this.getAccountingMovementDetail}
            insertAccountingMovementDetail={this.insertAccountingMovementDetail}
            deleteAccountingMovementDetail={this.deleteAccountingMovementDetail}
            getPaymentMethod={this.getPaymentMethod}
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            getAccounts={this.getAccounts}
        />, this.refs.render);
    }

    tabSaleInvoices() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<AccountingMovementSaleInvoices
            movementId={this.movement.id}
            getAccountingMovementSaleInvoices={this.getAccountingMovementSaleInvoices}
            getSalesInvoicesFuntions={this.getSalesInvoicesFuntions}
        />, this.refs.render);
    }

    tabPurchaseInvoices() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<AccountingMovementPurchaseInvoices
            movementId={this.movement.id}
            getAccountingMovementPurchaseInvoices={this.getAccountingMovementPurchaseInvoices}
            getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
        />, this.refs.render);
    }

    tabColletionOperations() {
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<AccountingMovementCharges
            movementId={this.movement.id}
            getColletionOperations={this.getColletionOperations}
            insertCharges={this.insertCharges}
            getCharges={this.getCharges}
            deleteCharges={this.deleteCharges}
        />, this.refs.render);
    }

    tabPaymentTransactions() {
        this.tab = 4;
        this.tabs();
        ReactDOM.render(<AccountingMovementPayments
            movementId={this.movement.id}
            getPaymentTransactions={this.getPaymentTransactions}
            insertPayment={this.insertPayment}
            getPayments={this.getPayments}
            deletePayment={this.deletePayment}
        />, this.refs.render);
    }

    delete() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deleteAccountingMovement(this.movement.id).then((ok) => {
                        if (ok) {
                            this.tabAccountingMovements();
                        }
                    });
                }}
            />,
            this.refs.renderModal);
    }

    transactionLog() {
        if (this.movement == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"accounting_movement"}
            registerId={this.movement.id}
        />,
            this.refs.renderModal);
    }

    render() {
        return <div id="tabAccountingMovement" className="formRowRoot">
            <div ref="renderModal"></div>
            <div id="renderModalDetail2"></div>
            <h4 className="ml-2">{i18next.t('accounting-movement')}</h4>
            <div class="form-row mt-2 mb-2">
                <div class="col">
                    <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                        defaultValue={window.dateFormat(this.movement.dateCreated)} />
                </div>
                <div class="col">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('type')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            defaultValue={this.movement.type}
                            disabled={true}
                        >
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
                            disabled={true}
                        >
                            <option>{this.movement.billingSerie.name}</option>
                        </NativeSelect>
                    </FormControl>
                </div>
            </div>

            <div className="mt-1 mb-1" ref="tabs">

            </div>

            <div ref="render">

            </div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm" className="pt-1">
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            {this.movement != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>

                    <button type="button" class="btn btn-secondary" onClick={this.tabAccountingMovements}>{i18next.t('cancel')}</button>
                    <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button>
                </div>
            </div>
        </div>
    }
}



export default AccountingMovementForm;
