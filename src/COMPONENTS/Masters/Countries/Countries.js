import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CountriesModal from './CountriesModal';

const zones = {
    "N": "National",
    "U": "European Union",
    "E": "Export"
}

class Countries extends Component {
    constructor({ getCountries, addCountry, updateCountry, deleteCountry, findLanguagesByName, findCurrencyByName, getNameLanguage, getNameCurrency }) {
        super();

        this.getCountries = getCountries;
        this.addCountry = addCountry;
        this.updateCountry = updateCountry;
        this.deleteCountry = deleteCountry;
        this.findLanguagesByName = findLanguagesByName;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameLanguage = getNameLanguage;
        this.getNameCurrency = getNameCurrency;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getCountries().then((countries) => {
            ReactDOM.render(countries.map((element, i) => {
                return <Country key={i}
                    country={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCountryModal'));
        ReactDOM.render(
            <CountriesModal
                addCountry={this.addCountry}
                findLanguagesByName={this.findLanguagesByName}
                findCurrencyByName={this.findCurrencyByName}
            />,
            document.getElementById('renderCountryModal'));
    }

    async edit(country) {
        const defaultValueNameLanguage = await this.getNameLanguage(country.language);
        const defaultValueNameCurrency = await this.getNameCurrency(country.currency);
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCountryModal'));
        ReactDOM.render(
            <CountriesModal
                country={country}
                updateCountry={this.updateCountry}
                deleteCountry={this.deleteCountry}
                findLanguagesByName={this.findLanguagesByName}
                findCurrencyByName={this.findCurrencyByName}
                defaultValueNameLanguage={defaultValueNameLanguage}
                defaultValueNameCurrency={defaultValueNameCurrency}
            />,
            document.getElementById('renderCountryModal'));
    }

    render() {
        return <div id="tabCountry">
            <div id="renderCountryModal"></div>
            <h1>Countries</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
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
