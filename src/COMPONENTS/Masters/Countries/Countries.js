import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import CountriesModal from './CountriesModal';
import SearchField from '../../SearchField';

const zones = {
    "N": "national",
    "U": "european-union",
    "E": "export"
}

class Countries extends Component {
    constructor({ getCountries, searchCountries, addCountry, updateCountry, deleteCountry, findLanguagesByName, findCurrencyByName,
        getNameLanguage, getNameCurrency }) {
        super();

        this.getCountries = getCountries;
        this.searchCountries = searchCountries;
        this.addCountry = addCountry;
        this.updateCountry = updateCountry;
        this.deleteCountry = deleteCountry;
        this.findLanguagesByName = findLanguagesByName;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameLanguage = getNameLanguage;
        this.getNameCurrency = getNameCurrency;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.printCountries();
    }

    printCountries() {
        this.getCountries().then((countries) => {
            this.renderCountries(countries);
        });
    }

    renderCountries(countries) {
        console.log(countries)
        this.list = countries;
        this.forceUpdate();
    }

    async search(search) {
        const countries = await this.searchCountries(search);
        this.renderCountries(countries);
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCountryModal'));
        ReactDOM.render(
            <CountriesModal
                addCountry={(country) => {
                    const promise = this.addCountry(country);
                    promise.then((ok) => {
                        if (ok) {
                            this.printCountries();
                        }
                    });
                    return promise;
                }}
                findLanguagesByName={this.findLanguagesByName}
                findCurrencyByName={this.findCurrencyByName}
            />,
            document.getElementById('renderCountryModal'));
    }

    async edit(country) {
        var defaultValueNameLanguage;
        if (country.language != null)
            defaultValueNameLanguage = await this.getNameLanguage(country.language);
        var defaultValueNameCurrency;
        if (country.currency != null)
            defaultValueNameCurrency = await this.getNameCurrency(country.currency);
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCountryModal'));
        ReactDOM.render(
            <CountriesModal
                country={country}
                updateCountry={(country) => {
                    const promise = this.updateCountry(country);
                    promise.then((ok) => {
                        if (ok) {
                            this.printCountries();
                        }
                    });
                    return promise;
                }}
                deleteCountry={(countryId) => {
                    const promise = this.deleteCountry(countryId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printCountries();
                        }
                    });
                    return promise;
                }}
                findLanguagesByName={this.findLanguagesByName}
                findCurrencyByName={this.findCurrencyByName}
                defaultValueNameLanguage={defaultValueNameLanguage}
                defaultValueNameCurrency={defaultValueNameCurrency}
            />,
            document.getElementById('renderCountryModal'));
    }

    render() {
        return <div id="tabCountry" className="formRowRoot">
            <div id="renderCountryModal"></div>
            <h1>{i18next.t('countries')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} />
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'iso2', headerName: 'ISO 2', width: 150 },
                    { field: 'iso3', headerName: 'ISO 3', width: 150 },
                    { field: 'unCode', headerName: i18next.t('un-code'), width: 150 },
                    {
                        field: 'zone', headerName: i18next.t('zone'), width: 200, valueGetter: (params) => {
                            return i18next.t(zones[params.row.zone])
                        }
                    }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Countries;
