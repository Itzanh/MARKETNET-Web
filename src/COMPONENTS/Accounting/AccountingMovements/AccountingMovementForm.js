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



class AccountingMovementForm extends Component {
    constructor({ movement, deleteAccountingMovement, getAccountingMovementDetail, insertAccountingMovementDetail, deleteAccountingMovementDetail,
        tabAccountingMovements, getAccountingMovementSaleInvoices, getAccountingMovementPurchaseInvoices, getPaymentMethod, getColletionOperations,
        insertCharges, getCharges, deleteCharges, getPaymentTransactions, insertPayment, getPayments, deletePayment, getSalesInvoicesFuntions,
        getPurcaseInvoicesFunctions }) {
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

        this.getSalesInvoicesFuntions = getSalesInvoicesFuntions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;

        this.tab = 0;

        this.tabDetais = this.tabDetais.bind(this);
        this.tabSaleInvoices = this.tabSaleInvoices.bind(this);
        this.tabPurchaseInvoices = this.tabPurchaseInvoices.bind(this);
        this.tabColletionOperations = this.tabColletionOperations.bind(this);
        this.tabPaymentTransactions = this.tabPaymentTransactions.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.tabs();
        this.tabDetais();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{
            'backgroundColor': '#343a40'
        }}>
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

    render() {
        return <div id="tabAccountingMovement" className="formRowRoot">
            <div ref="renderModal"></div>
            <h4>{i18next.t('accounting-movement')}</h4>
            <div class="form-row">
                <div class="col">
                    <label>ID</label>
                    <input type="text" class="form-control" defaultValue={this.movement.id} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('date-created')}</label>
                    <input type="text" class="form-control" defaultValue={window.dateFormat(this.movement.dateCreated)} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('type')}</label>
                    <select class="form-control" defaultValue={this.movement.type} disabled={true}>
                        <option value="O">{i18next.t('opening')}</option>
                        <option value="N">{i18next.t('normal')}</option>
                        <option value="V">{i18next.t('variation-of-existences')}</option>
                        <option value="R">{i18next.t('regularisation')}</option>
                        <option value="C">{i18next.t('closing')}</option>
                    </select>
                </div>
                <div class="col">
                    <label>{i18next.t('billing-serie')}</label>
                    <select class="form-control" disabled={true}>
                        <option>{this.movement.billingSerieName}</option>
                    </select>
                </div>
            </div>

            <div className="mt-1 mb-1" ref="tabs">

            </div>

            <div ref="render">

            </div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm" className="pt-1">
                    <button type="button" class="btn btn-secondary" onClick={this.tabAccountingMovements}>{i18next.t('cancel')}</button>
                    <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button>
                </div>
            </div>
        </div>
    }
}



export default AccountingMovementForm;
