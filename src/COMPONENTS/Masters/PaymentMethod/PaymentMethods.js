/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

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
            <h4 className="ml-2">{i18next.t('payment-methods')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
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
