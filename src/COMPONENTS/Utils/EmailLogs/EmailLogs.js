/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

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

import { TextField } from "@material-ui/core";



class EmailLogs extends Component {
    constructor({ getEmailLogs }) {
        super();

        this.list = [];

        this.getEmailLogs = getEmailLogs;

        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getEmailLogs({}).then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    edit(log) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<EmailLogsModal
            log={log}
        />, this.refs.renderModal);
    }

    search() {
        const search = {};
        search.searchText = this.refs.searchText.value;

        if (this.refs.dateSentStartDate.value != "" && this.refs.dateSentStartTime.value != "") {
            search.dateSentStart = new Date(this.refs.dateSentStartDate.value + " " + this.refs.dateSentStartTime.value);
        }

        if (this.refs.dateSentEndDate.value != "" && this.refs.dateSentEndTime.value != "") {
            search.dateSentEnd = new Date(this.refs.dateSentEndDate.value + " " + this.refs.dateSentEndTime.value);
        }

        this.getEmailLogs(search).then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    render() {
        return <div id="tabEmailLogs" className="formRowRoot">
            <div ref="renderModal"></div>
            <h4 className="ml-2">{i18next.t('email-logs')}</h4>
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
                    <label for="start">{i18next.t('search')}</label>
                    <br />
                    <input type="text" class="form-control" ref="searchText" />
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
                    { field: 'emailFrom', headerName: i18next.t('email-from'), width: 250 },
                    { field: 'nameFrom', headerName: i18next.t('name-from'), width: 250 },
                    { field: 'destinationEmail', headerName: i18next.t('destination-address'), width: 250 },
                    { field: 'destinationName', headerName: i18next.t('destination-name'), width: 250 },
                    { field: 'subject', headerName: i18next.t('subject'), flex: 1 },
                    {
                        field: 'dateSent', headerName: i18next.t('date'), width: 200, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateSent)
                        }
                    },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class EmailLogsModal extends Component {
    constructor({ log }) {
        super();

        this.log = log;
        this.open = true;

        this.handleClose = this.handleClose.bind(this);
    }


    handleClose() {
        this.open = false;
        this.forceUpdate();
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

    DialogTitleProduct = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => {
                    ReactDOM.unmountComponentAtNode(this.refs.render);
                }}>
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

    render() {
        return (<div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lx'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('email-log')}
                </this.DialogTitle>
                <DialogContent>
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('email-from')} variant="outlined" fullWidth size="small"
                                defaultValue={this.log.emailFrom} InputProps={{ readOnly: true }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('name-from')} variant="outlined" fullWidth size="small"
                                defaultValue={this.log.nameFrom} InputProps={{ readOnly: true }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('destination-address')} variant="outlined" fullWidth size="small"
                                defaultValue={this.log.destinationEmail} InputProps={{ readOnly: true }} />
                        </div>
                    </div>
                    <div class="form-row mt-2">
                        <div class="col">
                            <TextField label={i18next.t('destination-name')} variant="outlined" fullWidth size="small"
                                defaultValue={this.log.destinationName} InputProps={{ readOnly: true }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('subject')} variant="outlined" fullWidth size="small"
                                defaultValue={this.log.subject} InputProps={{ readOnly: true }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('date')} variant="outlined" fullWidth size="small"
                                defaultValue={window.dateFormat(this.log.dateSent)} InputProps={{ readOnly: true }} />
                        </div>
                    </div>
                    <br />
                    <TextField label={i18next.t('content')} variant="outlined" fullWidth size="small" defaultValue={this.log.content}
                        multiline maxRows={30} minRows={15} />
                </DialogContent>
                <DialogActions>
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                </DialogActions>
            </Dialog>
        </div>);
    }
}



export default EmailLogs;
