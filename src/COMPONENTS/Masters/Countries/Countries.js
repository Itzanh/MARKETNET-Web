import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CountriesModal from './CountriesModal';
import SearchField from '../../SearchField';

const zones = {
    "N": "National",
    "U": "European Union",
    "E": "Export"
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
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(countries.map((element, i) => {
            return <Country key={i}
                country={element}
                edit={this.edit}
            />
        }), this.refs.render);
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
            <div className="menu">
                <h1>Countries</h1>
                <div class="form-row">
                    <div class="col">
                        <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                    </div>
                    <div class="col">
                        <SearchField handleSearch={this.search} />
                    </div>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">ISO 2</th>
                        <th scope="col">ISO 3</th>
                        <th scope="col">UN Code</th>
                        <th scope="col">Zone</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Country extends Component {
    constructor({ country, edit }) {
        super();

        this.country = country;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.country);
        }}>
            <th scope="row">{this.country.id}</th>
            <td>{this.country.name}</td>
            <td>{this.country.iso2}</td>
            <td>{this.country.iso3}</td>
            <td>{this.country.unCode}</td>
            <td>{zones[this.country.zone]}</td>
        </tr>
    }
}

export default Countries;
