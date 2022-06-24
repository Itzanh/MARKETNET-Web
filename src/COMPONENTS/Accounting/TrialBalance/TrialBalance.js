/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import ReactDOM from 'react-dom';

import { Component } from "react";
import i18next from "i18next";
import { DataGrid } from '@material-ui/data-grid';
import AlertModal from '../../AlertModal';



class TrialBalance extends Component {
    constructor({ getTrialBalance, getJournals }) {
        super();

        this.getTrialBalance = getTrialBalance;
        this.getJournals = getJournals;

        this.list = [];

        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.renderJournals();
    }

    renderJournals() {
        this.getJournals().then((journals) => {
            ReactDOM.unmountComponentAtNode(this.refs.journal);
            ReactDOM.render(journals.map((element, i) => {
                return <option value={element.id} key={i}>{element.id + " - " + element.name}</option>
            }), this.refs.journal);
        });
    }

    isValid() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        if (this.refs.start.value == "") {
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-must-specify-the-start-date')}
            />, this.refs.renderModal);
            return false;
        }
        if (this.refs.end.value == "") {
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-must-specify-the-final-date')}
            />, this.refs.renderModal);
            return false;
        }
        return true;
    }

    search() {
        if (!this.isValid()) {
            return;
        }

        this.getTrialBalance({
            journal: parseInt(this.refs.journal.value),
            dateStart: new Date(this.refs.start.value),
            dateEnd: new Date(this.refs.end.value)
        }).then((list) => {
            for (let i = 0; i < list.length; i++) {
                list[i].id = i;
            }
            this.list = list;
            this.forceUpdate();
        });
    }

    padLeadingZeros(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    render() {
        return <div className="formRowRoot">
            <h4 className="ml-2">{i18next.t('trial-balance')}</h4>
            <div ref="renderModal"></div>
            <div class="form-row mb-2 ml-2">
                <div class="col">
                    <label>{i18next.t('journal')}</label>
                    <select id="journal" class="form-control" ref="journal">

                    </select>
                </div>
                <div class="col">
                    <label for="start">{i18next.t('start-date')}:</label>
                    <br />
                    <input type="date" class="form-control" ref="start" />
                </div>
                <div class="col">
                    <label for="start">{i18next.t('end-date')}:</label>
                    <br />
                    <input type="date" class="form-control" ref="end" />
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary mt-4" onClick={this.search}>{i18next.t('search')}</button>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: '', headerName: '#', width: 200, valueGetter: (params) => {
                            return params.row.journalId + "." + this.padLeadingZeros(params.row.account.accountNumber, 6);
                        }
                    },
                    {
                        field: 'name', headerName: i18next.t('name'), flex: 1, valueGetter: (params) => {
                            return params.row.account.name;
                        }
                    },
                    { field: 'credit', headerName: i18next.t('credit'), width: 200 },
                    { field: 'debit', headerName: i18next.t('debit'), width: 200 },
                    { field: 'balance', headerName: i18next.t('balance'), width: 200 }
                ]}
            />
        </div>
    }
}



export default TrialBalance;
