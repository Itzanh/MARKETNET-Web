import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import SearchField from "../../SearchField";
import AccountingMovementForm from "./AccountingMovementForm";

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
        insertPayment, getPayments, deletePayment, getRegisterTransactionalLogs, getSalesInvoicesFuntions, getPurcaseInvoicesFunctions }) {
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
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}

                getSalesInvoicesFuntions={this.getSalesInvoicesFuntions}
                getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
            />,
            document.getElementById('renderTab'));
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
                    <SearchField handleSearch={this.search} hasAdvancedSearch={false} />
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



export default AccountingMovements;
