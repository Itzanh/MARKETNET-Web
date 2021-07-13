import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import PaymentTransactionModal from "../PaymentTransactionModal";
import TableContextMenu from "../../VisualComponents/TableContextMenu";

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

        this.list = [];

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getPendingPaymentTransaction().then((paymentTransactions) => {
            this.renderCharges(paymentTransactions);
        });
    }

    renderCharges(paymentTransactions) {
        ReactDOM.render(paymentTransactions.map((element, i) => {
            return <tr key={i} onClick={() => {
                this.edit(element);
            }} pos={i}>
                <th scope="row">{element.id}</th>
                <td>{element.bankName}</td>
                <td>{i18next.t(chagesStatus[element.status])}</td>
                <td>{window.dateFormat(element.dateCreated)}</td>
                <td>{window.dateFormat(element.dateExpiration)}</td>
                <td>{element.total}</td>
                <td>{element.paid}</td>
                <td>{element.paymentMethodName}</td>
            </tr>
        }), this.refs.render);
        this.list = paymentTransactions;
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
                    <tr onClick={(e) => {
                        e.preventDefault();
                        const field = e.target.getAttribute("field");

                        if (this.sortField == field) {
                            this.sortAscending = !this.sortAscending;
                        }
                        this.sortField = field;

                        var greaterThan = 1;
                        var lessThan = -1;
                        if (!this.sortAscending) {
                            greaterThan = -1;
                            lessThan = -1;
                        }

                        this.list.sort((a, b) => {
                            if (a[field] > b[field]) {
                                return greaterThan;
                            } else if (a[field] < b[field]) {
                                return lessThan;
                            } else {
                                return 0;
                            }
                        });
                        this.renderCharges(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="bankName" scope="col">{i18next.t('bank')}</th>
                        <th field="status" scope="col">{i18next.t('status')}</th>
                        <th field="dateCreated" scope="col">{i18next.t('date-created')}</th>
                        <th field="dateExpiration" scope="col">{i18next.t('date-expiration')}</th>
                        <th field="total" scope="col">{i18next.t('total')}</th>
                        <th field="paid" scope="col">{i18next.t('paid')}</th>
                        <th field="paymentMethodName" scope="col">{i18next.t('payment-method')}</th>
                    </tr>
                </thead>
                <tbody ref="render" onContextMenu={(e) => {
                    e.preventDefault();
                    const posX = e.pageX + "px";
                    const posY = e.pageY + "px";
                    if (document.getElementById("customContextMenu") === null) {
                        ReactDOM.render(<TableContextMenu
                            posX={posX}
                            posY={posY}
                            getList={() => {
                                return this.list;
                            }}
                            setList={(list) => {
                                this.renderCharges(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["id", "bankName", "status", "dateCreated", "dateExpiration", "total", "paid", "paymentMethodName"]}
                        />, document.getElementById("contextMenu"));
                    } else {
                        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
                    }
                }}></tbody>
            </table>
        </div>
    }
}

export default Payments;
