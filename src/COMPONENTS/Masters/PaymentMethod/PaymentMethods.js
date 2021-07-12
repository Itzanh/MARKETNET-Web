import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import PaymentMethodModal from './PaymentMethodModal';


class PaymentMethods extends Component {
    constructor({ getPaymentMethod, addPaymentMehod, updatePaymentMethod, deletePaymentMethod, locateAccountForBanks }) {
        super();

        this.getPaymentMethod = getPaymentMethod;
        this.addPaymentMehod = addPaymentMehod;
        this.updatePaymentMethod = updatePaymentMethod;
        this.deletePaymentMethod = deletePaymentMethod;
        this.locateAccountForBanks = locateAccountForBanks;

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
                locateAccountForBanks={this.locateAccountForBanks}
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
                locateAccountForBanks={this.locateAccountForBanks}
            />,
            document.getElementById('renderPaymentMethodsModal'));
    }

    render() {
        return <div id="tabPaymentMethods">
            <div id="renderPaymentMethodsModal"></div>
            <div className="menu">
                <h1>{i18next.t('payment-methods')}</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                        <th scope="col">{i18next.t('paid-in-advance')}</th>
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
            <td>{this.paymentMethod.paidInAdvance ? i18next.t('yes') : i18next.t('no')}</td>
        </tr>
    }
}

export default PaymentMethods;
