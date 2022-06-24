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

import StatesModal from './StatesModal';
import SearchField from '../../SearchField';


class States extends Component {
    constructor({ findCountryByName, searchStates, getStates, addStates, updateStates, deleteStates }) {
        super();

        this.list = [];

        this.findCountryByName = findCountryByName;
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
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCitiesModal'));
        ReactDOM.render(
            <StatesModal
                state={state}
                findCountryByName={this.findCountryByName}
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
            <h4 className="ml-2">{i18next.t('states')}</h4>
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
                    {
                        field: 'countryName', headerName: i18next.t('country'), width: 300, valueGetter: (params) => {
                            return params.row.country.name;
                        }
                    },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    {
                        field: 'isoCode', headerName: i18next.t('iso-code'), width: 150
                    }
                ]}
                pageSize={100}
                rowsPerPageOptions={[25, 50, 100]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default States;
