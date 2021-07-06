import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import CurrenciesModal from './CurrenciesModal';


class Currencies extends Component {
    constructor({ getCurrencies, addCurrency, updateCurrency, deleteCurrency }) {
        super();

        this.getCurrencies = getCurrencies;
        this.addCurrency = addCurrency;
        this.updateCurrency = updateCurrency;
        this.deleteCurrency = deleteCurrency;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderCurrencies();
    }

    renderCurrencies() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getCurrencies().then((currencies) => {
            ReactDOM.render(currencies.map((element, i) => {
                return <Currency key={i}
                    currency={element}
                    edit={this.edit}
                />
            }), this.refs.render);
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
            <div className="menu">
                <h1>{i18next.t('currencies')}</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                        <th scope="col">{i18next.t('sign')}</th>
                        <th scope="col">{i18next.t('iso-code')}</th>
                        <th scope="col">{i18next.t('numeric-iso-code')}</th>
                        <th scope="col">{i18next.t('change')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Currency extends Component {
    constructor({ currency, edit }) {
        super();

        this.currency = currency;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.currency);
        }}>
            <th scope="row">{this.currency.id}</th>
            <td>{this.currency.name}</td>
            <td>{this.currency.sign}</td>
            <td>{this.currency.isoCode}</td>
            <td>{this.currency.isoNum}</td>
            <td>{this.currency.change}</td>
        </tr>
    }
}

export default Currencies;
