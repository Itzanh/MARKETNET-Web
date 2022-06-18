import ReactDOM from 'react-dom';

import { Component } from "react";
import { DataGrid } from '@material-ui/data-grid';
import i18next from 'i18next';



class ConnectionLog extends Component {
    constructor({ getConnectionLogs, getUsers }) {
        super();

        this.getConnectionLogs = getConnectionLogs;
        this.getUsers = getUsers;

        this.list = [];
        this.loading = true;
        this.rows = 0;

        this.search = this.search.bind(this);
    }

    async componentDidMount() {
        await this.renderUsers();
        this.search();
    }

    renderUsers() {
        return new Promise((resolve) => {
            this.getUsers().then((users) => {
                ReactDOM.unmountComponentAtNode(this.refs.user);
                users = users.map((element, i) => {
                    return <option value={element.id} key={i}>{element.username}</option>
                });
                users.unshift(<option value="" key={-1}>.{i18next.t('all')}</option>)
                ReactDOM.render(users, this.refs.user);
                resolve();
            });
        });
    }

    search() {
        const search = {
            offset: 0,
            limit: 100,
        };

        if (this.refs.dateSentStartDate.value != "" && this.refs.dateSentStartTime.value != "") {
            search.dateSentStart = new Date(this.refs.dateSentStartDate.value + " " + this.refs.dateSentStartTime.value);
        }

        if (this.refs.dateSentEndDate.value != "" && this.refs.dateSentEndTime.value != "") {
            search.dateSentEnd = new Date(this.refs.dateSentEndDate.value + " " + this.refs.dateSentEndTime.value);
        }

        if (this.refs.user.value == "") {
            search.userId = null;
        } else {
            search.userId = parseInt(this.refs.user.value);
        }

        if (this.refs.ok.value == "") {
            search.ok = null;
        } else if (this.refs.ok.value == "true") {
            search.ok = true;
        } else if (this.refs.ok.value == "false") {
            search.ok = false;
        }

        this.getConnectionLogs(search).then((logs) => {
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
            <div class="form-row ml-2">
                <div class="col">
                    <label for="start">{i18next.t('start-date')}</label>
                    <br />
                    <div class="form-row">
                        <div class="col">
                            <input type="date" class="form-control" ref="dateSentStartDate" />
                        </div>
                        <div class="col">
                            <input type="time" class="form-control" ref="dateSentStartTime" defaultValue="00:00" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label for="start">{i18next.t('end-date')}</label>
                    <br />
                    <div class="form-row">
                        <div class="col">
                            <input type="date" class="form-control" ref="dateSentEndDate" />
                        </div>
                        <div class="col">
                            <input type="time" class="form-control" ref="dateSentEndTime" defaultValue="23:59" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('user')}</label>
                    <select class="form-control" ref="user">

                    </select>
                </div>
                <div class="col">
                    <label>{i18next.t('ok')}</label>
                    <select class="form-control" ref="ok">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="true">{i18next.t('ok')}</option>
                        <option value="false">{i18next.t('not-ok')}</option>
                    </select>
                </div>
                <div class="col">
                    <label for="start"></label>
                    <br />
                    <button class="btn btn-outline-info" onClick={this.search}>{i18next.t('search')}</button>
                </div>
            </div>
            <br />
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'userName', headerName: i18next.t('username'), flex: 1, valueGetter: (params) => {
                            return params.row.user.username;
                        }
                    },
                    {
                        field: 'dateCreated', headerName: i18next.t('date-connected'), width: 200, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateConnected);
                        }
                    },
                    {
                        field: 'dateDisconnected', headerName: i18next.t('date-disconnected'), width: 200, valueGetter: (params) => {
                            return params.row.dateDisconnected == null ? '' : window.dateFormat(params.row.dateDisconnected);
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
