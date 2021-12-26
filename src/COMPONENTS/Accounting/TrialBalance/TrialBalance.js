import { Component } from "react";
import i18next from "i18next";
import { DataGrid } from '@material-ui/data-grid';



class TrialBalance extends Component {
    constructor({ getTrialBalance }) {
        super();

        this.getTrialBalance = getTrialBalance;

        this.list = [];

        this.search = this.search.bind(this);
    }

    search() {
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
            <h1>{i18next.t('trial-balance')}</h1>
            <div class="form-row mb-2">
                <div class="col">
                    <label>{i18next.t('journal')}</label>
                    <input type="number" class="form-control" ref="journal" min="0" defaultValue="0" />
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
                            return params.row.journal + "." + this.padLeadingZeros(params.row.accountNumber, 6)
                        }
                    },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'credit', headerName: i18next.t('credit'), width: 200 },
                    { field: 'debit', headerName: i18next.t('debit'), width: 200 },
                    { field: 'balance', headerName: i18next.t('balance'), width: 200 }
                ]}
            />
        </div>
    }
}



export default TrialBalance;
