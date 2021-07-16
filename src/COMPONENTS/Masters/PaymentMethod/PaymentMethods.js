import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import PaymentMethodModal from './PaymentMethodModal';


class PaymentMethods extends Component {
    constructor({ getPaymentMethod, addPaymentMehod, updatePaymentMethod, deletePaymentMethod, locateAccountForBanks }) {
        super();

        this.getPaymentMethod = getPaymentMethod;
        this.addPaymentMehod = addPaymentMehod;
        this.updatePaymentMethod = updatePaymentMethod;
        this.deletePaymentMethod = deletePaymentMethod;
        this.locateAccountForBanks = locateAccountForBanks;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderPaymentMethods();
    }

    renderPaymentMethods() {
        this.getPaymentMethod().then((paymentMethods) => {
            this.list = paymentMethods;
            this.forceUpdate();
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
            <h1>{i18next.t('payment-methods')}</h1>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'paidInAdvance', headerName: i18next.t('paid-in-advance'), width: 300, type: 'boolean' }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default PaymentMethods;
