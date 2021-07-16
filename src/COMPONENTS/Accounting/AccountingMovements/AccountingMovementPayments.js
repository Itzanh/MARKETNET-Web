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

class AccountingMovementPayments extends Component {
    constructor({ movementId, getPaymentTransactions, insertPayment, getPayments, deletePayment }) {
        super();

        this.movementId = movementId;
        this.getPaymentTransactions = getPaymentTransactions;
        this.insertPayment = insertPayment;
        this.getPayments = getPayments;
        this.deletePayment = deletePayment;

        this.list = [];

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderCharges();
    }

    renderCharges() {
        this.getPaymentTransactions(this.movementId).then((paymentTransactions) => {
            this.list = paymentTransactions;
            this.forceUpdate();
        });
    }

    edit(paymentTransaction) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<PaymentTransactionModal
            paymentTransaction={paymentTransaction}
            insertPayment={this.insertPayment}
            getPayments={this.getPayments}
            deletePayment={this.deletePayment}
        />, this.refs.renderModal);
    }

    render() {
        return <div>
            <div ref="renderModal"></div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'bankName', headerName: i18next.t('bank'), width: 200 },
                    {
                        field: 'status', headerName: i18next.t('status'), flex: 1, valueGetter: (params) => {
                            return i18next.t(chagesStatus[params.row.status])
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
                    { field: 'total', headerName: i18next.t('total'), width: 250 },
                    { field: 'paid', headerName: i18next.t('paid'), width: 250 },
                    { field: 'paymentMethodName', headerName: i18next.t('payment-method'), width: 300 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default AccountingMovementPayments;
