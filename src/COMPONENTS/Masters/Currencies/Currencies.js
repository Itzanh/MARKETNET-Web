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

import CurrenciesModal from './CurrenciesModal';


class Currencies extends Component {
    constructor({ getCurrencies, addCurrency, updateCurrency, deleteCurrency, updateCurrencyExchange }) {
        super();

        this.getCurrencies = getCurrencies;
        this.addCurrency = addCurrency;
        this.updateCurrency = updateCurrency;
        this.deleteCurrency = deleteCurrency;
        this.updateCurrencyExchange = updateCurrencyExchange;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderCurrencies();
    }

    renderCurrencies() {
        this.getCurrencies().then((currencies) => {
            this.list = currencies;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCurrencyModal'));
        ReactDOM.render(
            <CurrenciesModal
                addCurrency={(currency) => {
                    const promise = this.addCurrency(currency);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCurrencies();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCurrencyModal'));
    }

    edit(currency) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCurrencyModal'));
        ReactDOM.render(
            <CurrenciesModal
                currency={currency}
                updateCurrency={(currency) => {
                    const promise = this.updateCurrency(currency);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCurrencies();
                        }
                    });
                    return promise;
                }}
                deleteCurrency={(currencyId) => {
                    const promise = this.deleteCurrency(currencyId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCurrencies();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCurrencyModal'));
    }

    render() {
        return <div id="tabCurrencies">
            <div id="renderCurrencyModal"></div>
            <h4 className="ml-2">{i18next.t('currencies')}</h4>
            <div class="btn-group">
                <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                <button class="btn btn-primary dropdown-toggle mb-2" type="button" id="dropdownMenuButton"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#" onClick={this.updateCurrencyExchange}>{i18next.t('update-currency-exchange')}</a>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'sign', headerName: i18next.t('sign'), width: 150 },
                    { field: 'isoCode', headerName: i18next.t('iso-code'), width: 200 },
                    { field: 'isoNum', headerName: i18next.t('numeric-iso-code'), width: 250 },
                    { field: 'change', headerName: i18next.t('change'), width: 200 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Currencies;
