import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PaymentMethodModal from './PaymentMethodModal';


class PaymentMethods extends Component {
    constructor({ getPaymentMethod, addPaymentMehod, updatePaymentMethod, deletePaymentMethod }) {
        super();

        this.getPaymentMethod = getPaymentMethod;
        this.addPaymentMehod = addPaymentMehod;
        this.updatePaymentMethod = updatePaymentMethod;
        this.deletePaymentMethod = deletePaymentMethod;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderPaymentMethods();
    }

    renderPaymentMethods() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getPaymentMethod().then((paymentMethods) => {
            ReactDOM.render(paymentMethods.map((element, i) => {
                return <PaymentMethod key={i}
                    paymentMethod={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderPaymentMethodsModal'));
        ReactDOM.render(
            <PaymentMethodModal
                addPaymentMehod={(paymentMethod) => {
                    const promise = this.addPaymentMehod(paymentMethod);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPaymentMethods();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderPaymentMethodsModal'));
    }

    edit(paymentMethod) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderPaymentMethodsModal'));
        ReactDOM.render(
            <PaymentMethodModal
                paymentMethod={paymentMethod}
                updatePaymentMethod={(paymentMethod) => {
                    const promise = this.updatePaymentMethod(paymentMethod);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPaymentMethods();
                        }
                    });
                    return promise;
                }}
                deletePaymentMethod={(paymentMethod) => {
                    const promise = this.deletePaymentMethod(paymentMethod);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPaymentMethods();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderPaymentMethodsModal'));
    }

    render() {
        return <div id="tabPaymentMethods">
            <div id="renderPaymentMethodsModal"></div>
            <h1>Payment Methods</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Paid in advance</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class PaymentMethod extends Component {
    constructor({ paymentMethod, edit }) {
        super();

        this.paymentMethod = paymentMethod;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.paymentMethod);
        }}>
            <th scope="row">{this.paymentMethod.id}</th>
            <td>{this.paymentMethod.name}</td>
            <td>{this.paymentMethod.paidInAdvance ? 'Yes' : 'No'}</td>
        </tr>
    }
}

export default PaymentMethods;
