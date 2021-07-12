import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from "i18next";

class PaymentTransactionModal extends Component {
    constructor({ paymentTransaction, insertPayment, getPayments, deletePayment }) {
        super();

        this.paymentTransaction = paymentTransaction;
        this.insertPayment = insertPayment;
        this.getPayments = getPayments;
        this.deletePayment = deletePayment;

        this.tab = 0;

        this.tabDetails = this.tabDetails.bind(this);
        this.tabCharges = this.tabCharges.bind(this);
    }

    componentDidMount() {
        window.$('#transactionModal').modal({ show: true });
        this.tabs();
        this.tabDetails();
    }

    tabs() {
        ReactDOM.render(<ul class="nav nav-tabs">
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabDetails}>{i18next.t('details')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabCharges}>{i18next.t('charges')}</a>
            </li>
        </ul>, this.refs.tabs);
    }

    tabDetails() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<PaymentTransactionModalDetails
            paymentTransaction={this.paymentTransaction}
        />, this.refs.render);
    }

    tabCharges() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<PaymentTransactionModalPayments
            paymentTransaction={this.paymentTransaction}
            insertPayment={this.insertPayment}
            getPayments={this.getPayments}
            deletePayment={this.deletePayment}
        />, this.refs.render);
    }

    render() {
        return <div class="modal fade" id="transactionModal" tabindex="-1" role="dialog" aria-labelledby="transactionModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="transactionModalLabel">{i18next.t('payment-transaction')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div ref="tabs">
                        </div>
                        <div ref="render">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

class PaymentTransactionModalDetails extends Component {
    constructor({ paymentTransaction }) {
        super();

        this.paymentTransaction = paymentTransaction;
    }

    render() {
        return <div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('date-created')}</label>
                    <input type="text" class="form-control" defaultValue={window.dateFormat(this.paymentTransaction.dateCreated)} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('date-expiration')}</label>
                    <input type="text" class="form-control" defaultValue={window.dateFormat(this.paymentTransaction.dateExpiration)}
                        readOnly={true} />
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('bank')}</label>
                    <input type="text" class="form-control" defaultValue={this.paymentTransaction.bankName} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('payment-method')}</label>
                    <input type="text" class="form-control" defaultValue={this.paymentTransaction.paymentMethodName} readOnly={true} />
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('total')}</label>
                    <input type="number" class="form-control" defaultValue={this.paymentTransaction.total} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('paid')}</label>
                    <input type="number" class="form-control" defaultValue={this.paymentTransaction.paid} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('pending')}</label>
                    <input type="number" class="form-control" defaultValue={this.paymentTransaction.pending} readOnly={true} />
                </div>
            </div>
            <label>{i18next.t('document-name')}</label>
            <input type="text" class="form-control" defaultValue={this.paymentTransaction.documentName} readOnly={true} />
            <label>{i18next.t('account-name')}</label>
            <input type="text" class="form-control" defaultValue={this.paymentTransaction.accountName} readOnly={true} />
            <label>{i18next.t('status')}</label>
            <select class="form-control" defaultValue={this.paymentTransaction.status} disabled={true}>
                <option value="P">{i18next.t('pending')}</option>
                <option value="C">{i18next.t('paid')}</option>
                <option value="U">{i18next.t('unpaid')}</option>
            </select>
        </div>
    }
}

class PaymentTransactionModalPayments extends Component {
    constructor({ paymentTransaction, insertPayment, getPayments, deletePayment }) {
        super();

        this.paymentTransaction = paymentTransaction;
        this.insertPayment = insertPayment;
        this.getPayments = getPayments;
        this.deletePayment = deletePayment;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.renderCharges();
    }

    renderCharges() {
        this.getPayments(this.paymentTransaction.id).then((payments) => {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(payments.map((element, i) => {
                return <tr key={i}>
                    <th scope="row">{window.dateFormat(element.dateCreated)}</th>
                    <td>{element.amount}</td>
                    <td onClick={() => {
                        this.deletePayment(element.id).then((ok) => {
                            if (ok) {
                                this.renderCharges();
                            }
                        });
                    }}>{i18next.t('delete')}</td>
                </tr>
            }), this.refs.render);
        });
    }

    add() {
        const payment = {
            concept: this.refs.concept.value,
            amount: parseFloat(this.refs.amount.value),
            paymentTransaction: this.paymentTransaction.id
        };

        this.insertPayment(payment).then((ok) => {
            if (ok) {
                this.renderCharges();
            }
        });
    }

    render() {
        return <div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('concept')}</label>
                    <input type="text" class="form-control" ref="concept" />
                </div>
                <div class="col">
                    <label>{i18next.t('amount')}</label>
                    <input type="number" class="form-control" defaultValue={this.paymentTransaction.pending} ref="amount" />
                </div>
                <div class="col" style={{ 'max-width': '15%' }}>
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">{i18next.t('date')}</th>
                        <th scope="col">{i18next.t('amount')}</th>
                        <th scope="col">{i18next.t('delete')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

export default PaymentTransactionModal;
