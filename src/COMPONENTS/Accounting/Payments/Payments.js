import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import PaymentTransactionModal from "../PaymentTransactionModal";
import { DataGrid } from '@material-ui/data-grid';

const chagesStatus = {
    "P": "pending",
    "C": "paid",
    "U": "unpaid"
}



class Payments extends Component {
    constructor({ getPendingPaymentTransaction, searchPaymentTransactions, insertPayment, getPayments, deletePayment, getRegisterTransactionalLogs }) {
        super();

        this.getPendingPaymentTransaction = getPendingPaymentTransaction;
        this.searchPaymentTransactions = searchPaymentTransactions;
        this.insertPayment = insertPayment;
        this.getPayments = getPayments;
        this.deletePayment = deletePayment;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.list = [];

        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getPendingPaymentTransaction().then((paymentTransactions) => {
            this.renderCharges(paymentTransactions);
        });
    }

    search() {
        const query = {};
        query.mode = parseInt(this.refs.mode.value);
        query.search = this.refs.search.value;

        if (this.refs.startDate.value != "") {
            var dateTime = this.refs.startDate.value;

            if (this.refs.startTime.value != "") {
                dateTime += " " + this.refs.startTime.value;
            } else {
                dateTime += " 00:00";
            }

            query.startDate = new Date(dateTime);
        }

        if (this.refs.endDate.value != "") {
            var dateTime = this.refs.endDate.value;

            if (this.refs.endTime.value != "") {
                dateTime += " " + this.refs.endTime.value;
            } else {
                dateTime += " 23:59";
            }

            query.endDate = new Date(dateTime);
        }

        this.searchPaymentTransactions(query).then((paymentTransactions) => {
            this.renderCharges(paymentTransactions);
        });
    }

    renderCharges(paymentTransactions) {
        this.list = paymentTransactions;
        this.forceUpdate();
    }

    edit(paymentTransaction) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<PaymentTransactionModal
            paymentTransaction={paymentTransaction}
            insertPayment={this.insertPayment}
            getPayments={this.getPayments}
            deletePayment={this.deletePayment}
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
        />, this.refs.renderModal);
    }

    render() {
        return <div id="tabCharges" className="formRowRoot">
            <div ref="renderModal"></div>
            <div id="renderModalPayments2"></div>
            <h4 className="ml-2">{i18next.t('payments')}</h4>
            <div class="form-row ml-2 mb-2">
                <div class="col">
                    <label>{i18next.t('status')}</label>
                    <select class="form-control" ref="mode">
                        <option value="0">.{i18next.t('all')}</option>
                        <option value="1">{i18next.t('pending')}</option>
                        <option value="2">{i18next.t('paid')}</option>
                        <option value="3">{i18next.t('unpaid')}</option>
                    </select>
                </div>
                <div class="col">
                    <label>{i18next.t('start-date')}</label>
                    <div class="form-row">
                        <div class="col">
                            <input type="date" class="form-control" ref="startDate" />
                        </div>
                        <div class="col">
                            <input type="time" class="form-control" ref="startTime" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('end-date')}</label>
                    <div class="form-row">
                        <div class="col">
                            <input type="date" class="form-control" ref="endDate" />
                        </div>
                        <div class="col">
                            <input type="time" class="form-control" ref="endTime" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('supplier')}</label>
                    <input type="text" class="form-control" ref="search" />
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.search}>{i18next.t('search')}</button>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'bankName', headerName: i18next.t('bank'), width: 200, valueGetter: (params) => {
                            return params.row.bank.name;
                        }
                    },
                    {
                        field: 'status', headerName: i18next.t('status'), width: 200, valueGetter: (params) => {
                            return i18next.t(chagesStatus[params.row.status])
                        }
                    },
                    {
                        field: 'supplierName', headerName: i18next.t('supplier'), flex: 11, valueGetter: (params) => {
                            return params.row.accountingMovement != null && params.row.accountingMovement.purchaseInvoice != null
                                && params.row.accountingMovement.purchaseInvoice.supplier != null ?
                                params.row.accountingMovement.purchaseInvoice.supplier.name : '';
                        }
                    },
                    {
                        field: 'dateCreated', headerName: i18next.t('date-created'), width: 200, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    {
                        field: 'dateExpiration', headerName: i18next.t('date-expiration'), width: 200, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateExpiration)
                        }
                    },
                    { field: 'total', headerName: i18next.t('total'), width: 200 },
                    { field: 'paid', headerName: i18next.t('paid'), width: 200 },
                    {
                        field: 'paymentMethodName', headerName: i18next.t('payment-method'), width: 250, valueGetter: (params) => {
                            return params.row.paymentMethod != null ? params.row.paymentMethod.name : '';
                        }
                    }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Payments;
