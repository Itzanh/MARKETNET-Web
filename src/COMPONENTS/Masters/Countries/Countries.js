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

import CountriesModal from './CountriesModal';
import SearchField from '../../SearchField';

const zones = {
    "N": "national",
    "U": "european-union",
    "E": "export"
}

class Countries extends Component {
    constructor({ getCountries, searchCountries, addCountry, updateCountry, deleteCountry, findLanguagesByName, findCurrencyByName }) {
        super();

        this.getCountries = getCountries;
        this.searchCountries = searchCountries;
        this.addCountry = addCountry;
        this.updateCountry = updateCountry;
        this.deleteCountry = deleteCountry;
        this.findLanguagesByName = findLanguagesByName;
        this.findCurrencyByName = findCurrencyByName;

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
            />,
            document.getElementById('renderCountryModal'));
    }

    render() {
        return <div id="tabCountry" className="formRowRoot">
            <div id="renderCountryModal"></div>
            <h4 className="ml-2">{i18next.t('countries')}</h4>
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
