import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import AccountingMovementDetails from "./AccountingMovementDetails";
import AccountingMovementSaleInvoices from "./AccountingMovementSaleInvoices";
import AccountingMovementPurchaseInvoices from "./AccountingMovementPurchaseInvoices";
import ConfirmDelete from "../../ConfirmDelete";
import AccountingMovementCharges from "./AccountingMovementCharges";
import AccountingMovementPayments from "./AccountingMovementPayments";
import SearchField from "../../SearchField";

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
        insertPayment, getPayments, deletePayment }) {
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

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getAccountingMovement().then((movements) => {
            this.renderMovements(movements);
        });
    }

    async search(searchText) {
        const movements = await this.searchAccountingMovements(searchText);
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
                            this.renderMovements();
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
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabAccountingMovements" className="formRowRoot">
            <div id="renderAccountingMovementsModal"></div>
            <h1>{i18next.t('accounting-movements')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={false} />
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
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
                    { field: 'billingSerieName', headerName: i18next.t('billing-serie'), flex: 1 },
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

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        window.$('#accountingMovementModal').modal({ show: true });

        this.renderBillingSeries();
    }

    async renderBillingSeries() {
        const series = await this.getBillingSeries();
        ReactDOM.render(series.map((element, i) => {
            return <option key={i} value={element.id}>{element.name}</option>
        }), this.refs.billingSerie);
    }

    add() {
        const movement = {
            type: this.refs.type.value,
            billingSerie: this.refs.billingSerie.value
        };
        this.insertAccountingMovement(movement).then((ok) => {
            if (ok) {
                window.$('#accountingMovementModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="accountingMovementModal" tabindex="-1" role="dialog" aria-labelledby="accountingMovementModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="accountingMovementModalLabel">{i18next.t('accounting-movement')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('type')}</label>
                            <select class="form-control" ref="type" defaultValue="N">
                                <option value="O">{i18next.t('opening')}</option>
                                <option value="N">{i18next.t('normal')}</option>
                                <option value="V">{i18next.t('variation-of-existences')}</option>
                                <option value="R">{i18next.t('regularisation')}</option>
                                <option value="C">{i18next.t('closing')}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('billing-serie')}</label>
                            <select class="form-control" ref="billingSerie">

                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                    </div>
                </div>
            </div>
        </div>
    }

}

class AccountingMovementForm extends Component {
    constructor({ movement, deleteAccountingMovement, getAccountingMovementDetail, insertAccountingMovementDetail, deleteAccountingMovementDetail,
        tabAccountingMovements, getAccountingMovementSaleInvoices, getAccountingMovementPurchaseInvoices, getPaymentMethod, getColletionOperations,
        insertCharges, getCharges, deleteCharges, getPaymentTransactions, insertPayment, getPayments, deletePayment }) {
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
        ReactDOM.render(<ul class="nav nav-tabs">
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabDetais}>{i18next.t('accounting-details')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabSaleInvoices}>{i18next.t('sale-invoices')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 2 ? " active" : "")} href="#" onClick={this.tabPurchaseInvoices}>{i18next.t('purchase-invoices')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 3 ? " active" : "")} href="#" onClick={this.tabColletionOperations}>{i18next.t('charges')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 4 ? " active" : "")} href="#" onClick={this.tabPaymentTransactions}>{i18next.t('payments')}</a>
            </li>
        </ul>, this.refs.tabs);
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
        />, this.refs.render);
    }

    tabPurchaseInvoices() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<AccountingMovementPurchaseInvoices
            movementId={this.movement.id}
            getAccountingMovementPurchaseInvoices={this.getAccountingMovementPurchaseInvoices}
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



export default AccountingMovements;
