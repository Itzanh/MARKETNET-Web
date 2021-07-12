import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import PaymentTransactionModal from "../PaymentTransactionModal";

const chagesStatus = {
    "P": "pending",
    "C": "paid",
    "U": "unpaid"
}

class Payments extends Component {
    constructor({ getPendingPaymentTransaction, insertPayment, getPayments, deletePayment }) {
        super();

        this.getPendingPaymentTransaction = getPendingPaymentTransaction;
        this.insertPayment = insertPayment;
        this.getPayments = getPayments;
        this.deletePayment = deletePayment;

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderCharges();
    }

    renderCharges() {
        this.getPendingPaymentTransaction().then((paymentTransactions) => {
            ReactDOM.render(paymentTransactions.map((element, i) => {
                return <tr key={i} onClick={() => {
                    this.edit(element);
                }}>
                    <th scope="row">{element.id}</th>
                    <td>{element.bankName}</td>
                    <td>{i18next.t(chagesStatus[element.status])}</td>
                    <td>{window.dateFormat(element.dateCreated)}</td>
                    <td>{window.dateFormat(element.dateExpiration)}</td>
                    <td>{element.total}</td>
                    <td>{element.paid}</td>
                    <td>{element.paymentMethodName}</td>
                </tr>
            }), this.refs.render)
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
        return <div id="tabCharges">
            <div ref="renderModal"></div>
            <div className="menu">
                <h1>{i18next.t('payments')}</h1>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('bank')}</th>
                        <th scope="col">{i18next.t('status')}</th>
                        <th scope="col">{i18next.t('date-created')}</th>
                        <th scope="col">{i18next.t('date-expiration')}</th>
                        <th scope="col">{i18next.t('total')}</th>
                        <th scope="col">{i18next.t('paid')}</th>
                        <th scope="col">{i18next.t('payment-method')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

export default Payments;
