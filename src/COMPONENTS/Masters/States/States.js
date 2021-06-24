import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import StatesModal from './StatesModal';
import SearchField from '../../SearchField';


class States extends Component {
    constructor({ findCountryByName, getCountryName, searchStates, getStates, addStates, updateStates, deleteStates }) {
        super();

        this.findCountryByName = findCountryByName;
        this.getCountryName = getCountryName;
        this.searchStates = searchStates;
        this.getStates = getStates;
        this.addStates = addStates;
        this.updateStates = updateStates;
        this.deleteStates = deleteStates;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.printStates();
    }

    printStates() {
        this.getStates().then((states) => {
            this.renderStates(states);
        });
    }

    async renderStates(states) {
        const countryNameCache = {};

        await ReactDOM.unmountComponentAtNode(this.refs.render);
        await ReactDOM.render(states.map((element, i) => {
            element.countryName = "...";
            return <State key={i}
                state={element}
                edit={this.edit}
            />
        }), this.refs.render);

        for (let i = 0; i < states.length; i++) {
            if (countryNameCache[states[i].country] != null) {
                states[i].countryName = countryNameCache[states[i].country];
            } else {
                states[i].countryName = await this.getCountryName(states[i].country);
                countryNameCache[states[i].country] = states[i].countryName;
            }
        }

        ReactDOM.render(states.map((element, i) => {
            return <State key={i}
                state={element}
                edit={this.edit}
            />
        }), this.refs.render);
    }

    async search(search) {
        const states = await this.searchStates(search);
        this.renderStates(states);
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCitiesModal'));
        ReactDOM.render(
            <StatesModal
                findCountryByName={this.findCountryByName}
                addStates={(states) => {
                    const promise = this.addStates(states);
                    promise.then((ok) => {
                        if (ok) {
                            this.printStates();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCitiesModal'));
    }

    async edit(state) {
        const defaultValueNameCountry = await this.getCountryName(state.country);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderCitiesModal'));
        ReactDOM.render(
            <StatesModal
                state={state}
                findCountryByName={this.findCountryByName}
                defaultValueNameCountry={defaultValueNameCountry}
                updateStates={(states) => {
                    const promise = this.updateStates(states);
                    promise.then((ok) => {
                        if (ok) {
                            this.printStates();
                        }
                    });
                    return promise;
                }}
                deleteStates={(statesId) => {
                    const promise = this.deleteStates(statesId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printStates();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCitiesModal'));
    }

    render() {
        return <div id="tabCities" className="formRowRoot">
            <div id="renderCitiesModal"></div>
            <h1>States</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} />
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Country</th>
                        <th scope="col">Name</th>
                        <th scope="col">ISO Code</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class State extends Component {
    constructor({ state, edit }) {
        super();

        this.state = state;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.state);
        }}>
            <th scope="row">{this.state.id}</th>
            <td>{this.state.countryName}</td>
            <td>{this.state.name}</td>
            <td>{this.state.isoCode}</td>
        </tr>
    }
}

export default States;
