import { Component } from "react";
import { DataGrid } from '@material-ui/data-grid';
import i18next from 'i18next';

class ConnectionLog extends Component {
    constructor({ getConnectionLogs }) {
        super();

        this.getConnectionLogs = getConnectionLogs;

        this.list = [];
        this.loading = true;
        this.rows = 0;
    }

    componentDidMount() {
        this.getConnectionLogs({
            offset: 0,
            limit: 100
        }).then((logs) => {
            this.renderConnectionLog(logs);
        });
    }

    renderConnectionLog(logs) {
        this.loading = false;
        this.list = logs.logs;
        this.rows = logs.rows;
        this.forceUpdate();
    }

    render() {
        return <div id="tabConnectionLog" className="formRowRoot">
            <h4 className="ml-2 mb-2">{i18next.t('connection-log')}</h4>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'userName', headerName: i18next.t('username'), flex: 1 },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    {
                        field: 'dateDisconnected', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'ok', headerName: 'Ok', width: 180, type: 'boolean' },
                    { field: 'ipAddress', headerName: i18next.t('address'), width: 170 },
                ]}
                loading={this.loading}
                onPageChange={(data) => {
                    this.getConnectionLogs({
                        offset: data.pageSize * data.page,
                        limit: data.pageSize
                    }).then(async (logs) => {
                        logs.logs = this.list.concat(logs.logs);
                        this.renderConnectionLog(logs);
                    });
                }}
                rowCount={this.rows}
            />
        </div>
    }
}

export default ConnectionLog;
