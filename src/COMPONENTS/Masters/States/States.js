import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import StatesModal from './StatesModal';
import SearchField from '../../SearchField';


class States extends Component {
    constructor({ findCountryByName, getCountryName, searchStates, getStates, addStates, updateStates, deleteStates }) {
        super();

        this.list = [];

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
        this.list = states;
        this.forceUpdate();
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
            <h1>{i18next.t('states')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
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
                    { field: 'countryName', headerName: i18next.t('country'), width: 300 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'isoCode', headerName: i18next.t('iso-code'), width: 150 }
                ]}
                pageSize={250}
                rowsPerPageOptions={[25, 50, 100, 250, 500]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default States;
