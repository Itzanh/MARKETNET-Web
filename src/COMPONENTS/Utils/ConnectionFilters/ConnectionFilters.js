/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { DataGrid } from '@material-ui/data-grid';
import i18next from 'i18next';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

const ConnectionFilterType = {
    "I": "IP",
    "S": "schedule"
};



class ConnectionFilters extends Component {
    constructor({ getConnectionFilters, insertConnectionFilters, updateConnectionFilters, deleteConnectionFilters, getConnectionFilterUser,
        insertConnectionFilterUser, deleteConnectionFilterUser, getUsers }) {
        super();

        this.getConnectionFilters = getConnectionFilters;
        this.insertConnectionFilters = insertConnectionFilters;
        this.updateConnectionFilters = updateConnectionFilters;
        this.deleteConnectionFilters = deleteConnectionFilters;
        this.getConnectionFilterUser = getConnectionFilterUser;
        this.insertConnectionFilterUser = insertConnectionFilterUser;
        this.deleteConnectionFilterUser = deleteConnectionFilterUser;
        this.getUsers = getUsers;

        this.list = [];
        this.loading = true;

        this.edit = this.edit.bind(this);
        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.getConnectionFilters().then((filters) => {
            this.renderConnectionFilters(filters);
        });
    }

    renderConnectionFilters(filters) {
        this.loading = false;
        this.list = filters;
        this.forceUpdate();
    }

    async edit(filter) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(
            <ConnectionFilter
                filter={filter}
                updateConnectionFilters={(filter) => {
                    return new Promise((resolve) => {
                        this.updateConnectionFilters(filter).then((ok) => {
                            this.getConnectionFilters().then((filters) => {
                                this.renderConnectionFilters(filters);
                            });
                            resolve(ok);
                        });
                    });
                }}
                deleteConnectionFilters={(filterId) => {
                    return new Promise((resolve) => {
                        this.deleteConnectionFilters(filterId).then((ok) => {
                            this.getConnectionFilters().then((filters) => {
                                this.renderConnectionFilters(filters);
                            });
                            resolve(ok);
                        });
                    });
                }}
                getConnectionFilterUser={this.getConnectionFilterUser}
                insertConnectionFilterUser={this.insertConnectionFilterUser}
                deleteConnectionFilterUser={this.deleteConnectionFilterUser}
                getUsers={this.getUsers}
            />,
            this.refs.renderModal);
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(
            <ConnectionFilter
                insertConnectionFilters={(filter) => {
                    return new Promise((resolve) => {
                        this.insertConnectionFilters(filter).then((ok) => {
                            this.getConnectionFilters().then((filters) => {
                                this.renderConnectionFilters(filters);
                            });
                            resolve(ok);
                        });
                    });
                }}
            />,
            this.refs.renderModal);
    }

    render() {
        return <div id="tabConnectionFilters" className="formRowRoot">
            <div ref="renderModal"></div>
            <h4 className="ml-2">{i18next.t('connection-filters')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>Add</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    {
                        field: 'type', headerName: i18next.t('type'), width: 160, valueGetter: (params) => {
                            return i18next.t(ConnectionFilterType[params.row.type])
                        }
                    },
                    {
                        field: '', headerName: i18next.t('data'), width: 160, valueGetter: (params) => {
                            var timeStart;
                            var timeEnd;
                            if (params.row.type == "S") {
                                timeStart = new Date(params.row.timeStart);
                                timeEnd = new Date(params.row.timeEnd);
                            }

                            return params.row.type == "I" ? params.row.ipAddress :
                                window.timeHourMinuteFormat(timeStart) + " - " + window.timeHourMinuteFormat(timeEnd);
                        }
                    },
                ]}
                loading={this.loading}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}



class ConnectionFilter extends Component {
    constructor({ filter, insertConnectionFilters, updateConnectionFilters, deleteConnectionFilters, getConnectionFilterUser, insertConnectionFilterUser,
        deleteConnectionFilterUser, getUsers }) {
        super();

        this.filter = filter;

        this.insertConnectionFilters = insertConnectionFilters;
        this.updateConnectionFilters = updateConnectionFilters;
        this.deleteConnectionFilters = deleteConnectionFilters;
        this.getConnectionFilterUser = getConnectionFilterUser;
        this.insertConnectionFilterUser = insertConnectionFilterUser;
        this.deleteConnectionFilterUser = deleteConnectionFilterUser;
        this.getUsers = getUsers;

        this.open = true;
        this.tab = 0;
        this.type = this.filter == null ? "I" : this.filter.type;
        this.list = [];
        this.userFilter = null;

        this.name = React.createRef();
        this.ipAddress = React.createRef();

        this.handleClose = this.handleClose.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.addUserFilter = this.addUserFilter.bind(this);
        this.edit = this.edit.bind(this);
        this.deleteUserFilter = this.deleteUserFilter.bind(this);
    }

    async componentDidMount() {
        if (this.filter != null) {
            this.list = await this.getConnectionFilterUser(this.filter.id);
            for (let i = 0; i < this.list.length; i++) {
                this.list[i].id = i;
            }
        }
    }

    getConnectionFilterFromForm() {
        const filter = {};
        filter.name = this.name.current.value;
        filter.type = document.getElementById("type").value;
        if (filter.type == "I") {
            filter.ipAddress = this.ipAddress.current.value;
        } else if (filter.type == "S") {
            const timeStart = this.refs.timeStart.value.split(":");
            filter.timeStart = new Date(Date.UTC(1970, 1, 1, timeStart[0], timeStart[1], 0));

            const timeEnd = this.refs.timeEnd.value.split(":");
            filter.timeEnd = new Date(Date.UTC(1970, 1, 1, timeEnd[0], timeEnd[1], 0));
        }
        return filter;
    }

    styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    DialogTitle = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    handleTabChange(_, tab) {
        this.tab = tab;
        this.forceUpdate();
    }

    add() {
        this.insertConnectionFilters(this.getConnectionFilterFromForm()).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const filter = this.getConnectionFilterFromForm();
        filter.id = this.filter.id;

        this.updateConnectionFilters(filter).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteConnectionFilters(this.filter.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    addUserFilter() {
        this.getUsers().then((users) => {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(
                <LocateUser
                    list={users}
                    onUserSelected={(userId) => {
                        this.insertConnectionFilterUser({
                            connectionFilterId: this.filter.id,
                            userId: userId
                        }).then(async (ok) => {
                            if (ok) {
                                this.list = await this.getConnectionFilterUser(this.filter.id);
                                for (let i = 0; i < this.list.length; i++) {
                                    this.list[i].id = i;
                                }
                                this.forceUpdate();
                            }
                        });
                    }}
                />,
                this.refs.renderModal);
        });
    }

    edit(userFilter) {
        this.userFilter = userFilter;
    }

    deleteUserFilter() {
        if (this.userFilter == null) {
            return;
        }

        this.deleteConnectionFilterUser(this.userFilter).then(async (ok) => {
            if (ok) {
                this.list = await this.getConnectionFilterUser(this.filter.id);
                for (let i = 0; i < this.list.length; i++) {
                    this.list[i].id = i;
                }
                this.forceUpdate();
            }
        });
    }

    render() {
        return (
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'} PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('connection-filters')}
                </this.DialogTitle>
                <DialogContent>
                    <div ref="renderModal"></div>
                    {this.filter == null ? null :
                        <AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
                            <Tabs value={this.tab} onChange={this.handleTabChange}>
                                <Tab label={i18next.t('details')} />
                                <Tab label={i18next.t('users')} />
                            </Tabs>
                        </AppBar>
                    }

                    {this.tab != 0 ? null : <div>
                        <br />
                        <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                            defaultValue={this.filter == null ? "" : this.filter.name} inputProps={{ maxLength: 100 }} />
                        <br />
                        <br />
                        <FormControl fullWidth>
                            <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('type')}</InputLabel>
                            <NativeSelect
                                style={{ 'marginTop': '0' }}
                                id="type"
                                defaultValue={this.filter == null ? "I" : this.filter.type}
                                onChange={() => {
                                    this.type = document.getElementById("type").value;
                                    this.forceUpdate();
                                }}
                                disabled={this.filter != null}
                            >
                                <option value="I">IP</option>
                                <option value="S">{i18next.t('schedule')}</option>
                            </NativeSelect>
                        </FormControl>
                        <br />
                        <br />

                        {!(this.type == "I") ? null :
                            <div>
                                <TextField label={i18next.t('address')} variant="outlined" fullWidth size="small" inputRef={this.ipAddress}
                                    defaultValue={this.filter == null ? "" : this.filter.ipAddress} />
                            </div>}
                        {!(this.type == "S") ? null :
                            <div>
                                <div class="form-row">
                                    <div class="col">
                                        <label></label>
                                        <input type="time" class="form-control" ref="timeStart" defaultValue={this.filter == null ? "" :
                                            (() => {
                                                return window.timeHourMinuteFormat(this.filter.timeStart);
                                                const timeStart = new Date(this.filter.timeStart.substring(0, this.filter.timeStart.length - 1));
                                                return (timeStart.getHours() < 10 ? "0" + (timeStart.getHours()) : timeStart.getHours())
                                                    + ":" + (timeStart.getMinutes() < 10 ? "0" + timeStart.getMinutes() : timeStart.getMinutes());
                                            })()} />
                                    </div>
                                    <div class="col">
                                        <label></label>
                                        <input type="time" class="form-control" ref="timeEnd" defaultValue={this.filter == null ? "" :
                                            (() => {
                                                return window.timeHourMinuteFormat(this.filter.timeEnd);
                                                const timeEnd = new Date(this.filter.timeEnd.substring(0, this.filter.timeEnd.length - 1));
                                                return (timeEnd.getHours() < 10 ? "0" + (timeEnd.getHours()) : timeEnd.getHours())
                                                    + ":" + (timeEnd.getMinutes() < 10 ? "0" + timeEnd.getMinutes() : timeEnd.getMinutes());
                                            })()} />
                                    </div>
                                </div>
                            </div>}
                    </div>}

                    {this.tab != 1 ? null : <div>
                        <button type="button" class="btn btn-primary mt-2 mb-2" onClick={this.addUserFilter}>Add user</button>
                        <button type="button" class="btn btn-danger mt-2 ml-1 mb-2" onClick={this.deleteUserFilter}>Remove user</button>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
                            columns={[
                                {
                                    field: 'userName', headerName: i18next.t('name'), flex: 1, valueGetter: (params) => {
                                        return params.row.user.username;
                                    }
                                },
                            ]}
                            onRowClick={(data) => {
                                this.edit(data.row);
                            }}
                        />
                    </div>}
                </DialogContent>
                <DialogActions>
                    {this.filter != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.filter == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.filter != null ? <button type="button" class="btn btn-success"
                        onClick={this.update}>{i18next.t('update')}</button> : null}
                </DialogActions>
            </Dialog>
        );
    }
}

class LocateUser extends Component {
    constructor({ list, onUserSelected }) {
        super();

        this.open = true;
        this.list = list;
        this.onUserSelected = onUserSelected;

        this.handleClose = this.handleClose.bind(this);
        this.edit = this.edit.bind(this);
    }

    styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    DialogTitle = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    edit(user) {
        this.handleClose();
        this.onUserSelected(user.id);
    }

    render() {
        return (
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'} PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('connection-filters')}
                </this.DialogTitle>
                <DialogContent>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.list}
                        columns={[
                            { field: 'id', headerName: '#', width: 150 },
                            { field: 'username', headerName: i18next.t('name'), flex: 1 },
                        ]}
                        onRowClick={(data) => {
                            this.edit(data.row);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                </DialogActions>
            </Dialog>
        );
    }
}



export default ConnectionFilters;
