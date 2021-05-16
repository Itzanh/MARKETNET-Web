import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CitiesModal from './CitiesModal';


class Cities extends Component {
    constructor({ findCountryByName, getCountryName, getCities, addCity, updateCity, deleteCity }) {
        super();

        this.findCountryByName = findCountryByName;
        this.getCountryName = getCountryName;
        this.getCities = getCities;
        this.addCity = addCity;
        this.updateCity = updateCity;
        this.deleteCity = deleteCity;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getCities().then(async (cities) => {
            await ReactDOM.render(cities.map((element, i) => {
                element.countryName = "...";
                return <City key={i}
                    city={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < cities.length; i++) {
                cities[i].countryName = await this.getCountryName(cities[i].country);
            }

            ReactDOM.render(cities.map((element, i) => {
                return <City key={i}
                    city={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCitiesModal'));
        ReactDOM.render(
            <CitiesModal
                findCountryByName={this.findCountryByName}
                addCity={this.addCity}
            />,
            document.getElementById('renderCitiesModal'));
    }

    async edit(city) {
        const defaultValueNameCountry = await this.getCountryName(city.country);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderCitiesModal'));
        ReactDOM.render(
            <CitiesModal
                city={city}
                findCountryByName={this.findCountryByName}
                defaultValueNameCountry={defaultValueNameCountry}
                updateCity={this.updateCity}
                deleteCity={this.deleteCity}
            />,
            document.getElementById('renderCitiesModal'));
    }

    render() {
        return <div id="tabCities">
            <div id="renderCitiesModal"></div>
            <h1>Cities</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Country</th>
                        <th scope="col">Name</th>
                        <th scope="col">ZIP Code</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class City extends Component {
    constructor({ city, edit }) {
        super();

        this.city = city;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.city);
        }}>
            <th scope="row">{this.city.id}</th>
            <td>{this.city.countryName}</td>
            <td>{this.city.name}</td>
            <td>{this.city.zipCode}</td>
        </tr>
    }
}

export default Cities;
