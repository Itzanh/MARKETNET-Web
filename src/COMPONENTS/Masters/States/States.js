import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import StatesModal from './StatesModal';


class States extends Component {
    constructor({ findCountryByName, getCountryName, getStates, addStates, updateStates, deleteStates }) {
        super();

        this.findCountryByName = findCountryByName;
        this.getCountryName = getCountryName;
        this.getStates = getStates;
        this.addStates = addStates;
        this.updateStates = updateStates;
        this.deleteStates = deleteStates;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getStates().then(async (states) => {
            await ReactDOM.render(states.map((element, i) => {
                element.countryName = "...";
                return <State key={i}
                    state={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < states.length; i++) {
                states[i].countryName = await this.getCountryName(states[i].country);
            }

            ReactDOM.render(states.map((element, i) => {
                return <State key={i}
                    state={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCitiesModal'));
        ReactDOM.render(
            <StatesModal
                findCountryByName={this.findCountryByName}
                addStates={this.addStates}
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
                updateStates={this.updateStates}
                deleteStates={this.deleteStates}
            />,
            document.getElementById('renderCitiesModal'));
    }

    render() {
        return <div id="tabCities">
            <div id="renderCitiesModal"></div>
            <h1>States</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
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
