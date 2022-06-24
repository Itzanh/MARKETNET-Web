/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from "i18next";
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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ConfirmDelete from "../ConfirmDelete";
import TransactionLogViewModal from "../VisualComponents/TransactionLogViewModal";
import { Button } from "@material-ui/core";

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";



class ChangesModal extends Component {
    constructor({ collectionOperation, insertCharges, getCharges, deleteCharges, getRegisterTransactionalLogs }) {
        super();

        this.collectionOperation = collectionOperation;
        this.insertCharges = insertCharges;
        this.getCharges = getCharges;
        this.deleteCharges = deleteCharges;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.tab = 0;
        this.open = true;

        this.tabDetails = this.tabDetails.bind(this);
        this.tabCharges = this.tabCharges.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.tabs();
            this.tabDetails();
        }, 10);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabDetails();
                        break;
                    }
                    case 1: {
                        this.tabCharges();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('details')} />
                <Tab label={i18next.t('charges')} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    tabDetails() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<ChangesModalDetails
            collectionOperation={this.collectionOperation}
        />, this.refs.render);
    }

    tabCharges() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<ChangesModalCharges
            collectionOperation={this.collectionOperation}
            insertCharges={this.insertCharges}
            getCharges={this.getCharges}
            deleteCharges={this.deleteCharges}
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
        />, this.refs.render);
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

    transactionLog() {
        if (this.collectionOperation == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderModalCharges2'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"collection_operation"}
            registerId={this.collectionOperation.id}
        />,
            document.getElementById('renderModalCharges2'));
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('collection-operation')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="tabs">
                </div>
                <div ref="render">
                </div>
            </DialogContent>
            <DialogActions>
                <div class="btn-group dropup">
                    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('options')}
                    </button>
                    <div class="dropdown-menu">
                        {this.collectionOperation != null ?
                            <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                    </div>
                </div>

                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}

class ChangesModalDetails extends Component {
    constructor({ collectionOperation }) {
        super();

        this.collectionOperation = collectionOperation;
    }

    render() {
        return <div>
            <div class="form-group mt-3">
                <div class="form-row">
                    <div class="col">
                        <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                            defaultValue={window.dateFormat(this.collectionOperation.dateCreated)} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('date-expiration')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                            defaultValue={window.dateFormat(this.collectionOperation.dateExpiration)} />
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="form-row">
                    <div class="col">
                        <TextField label={i18next.t('bank')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                            defaultValue={this.collectionOperation.bank.name} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('payment-method')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                            defaultValue={this.collectionOperation.paymentMethod.name} />
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="form-row">
                    <div class="col">
                        <TextField label={i18next.t('total')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small" type="number"
                            defaultValue={this.collectionOperation.total} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('paid')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small" type="number"
                            defaultValue={this.collectionOperation.paid} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('pending')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small" type="number"
                            defaultValue={this.collectionOperation.pending} />
                    </div>
                </div>
            </div>
            <div class="form-group">
                <TextField label={i18next.t('document-name')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                    defaultValue={this.collectionOperation.documentName} />
            </div>
            <div class="form-group">
                <TextField label={i18next.t('account-name')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                    defaultValue={this.collectionOperation.account.accountName} />
            </div>
            <div class="form-group">
                <FormControl fullWidth>
                    <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('status')}</InputLabel>
                    <NativeSelect
                        style={{ 'marginTop': '0' }}
                        defaultValue={this.collectionOperation.status}
                        disabled={true}
                    >
                        <option value="P">{i18next.t('pending')}</option>
                        <option value="C">{i18next.t('paid')}</option>
                        <option value="U">{i18next.t('unpaid')}</option>
                    </NativeSelect>
                </FormControl>
            </div>
        </div>
    }
}

class ChangesModalCharges extends Component {
    constructor({ collectionOperation, insertCharges, getCharges, deleteCharges, getRegisterTransactionalLogs }) {
        super();

        this.collectionOperation = collectionOperation;
        this.insertCharges = insertCharges;
        this.getCharges = getCharges;
        this.deleteCharges = deleteCharges;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.list = [];

        this.concept = React.createRef();
        this.amount = React.createRef();

        this.add = this.add.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    componentDidMount() {
        this.renderCharges();
    }

    renderCharges() {
        this.getCharges(this.collectionOperation.id).then((charges) => {
            this.list = charges;
            this.forceUpdate();
        });
    }

    add() {
        const charge = {
            concept: this.concept.current.value,
            amount: parseFloat(this.amount.current.value),
            collectionOperationId: this.collectionOperation.id
        };

        this.insertCharges(charge).then((ok) => {
            if (ok) {
                this.renderCharges();
            }
        });
    }

    transactionLog(rowId) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderModalCharges2'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"charges"}
            registerId={rowId}
        />,
            document.getElementById('renderModalCharges2'));
    }

    render() {
        return <div>
            <div id="renderConfirmDelete"></div>
            <div class="form-row mb-2 mt-3">
                <div class="col">
                    <TextField label={i18next.t('concept')} variant="outlined" fullWidth size="small" inputRef={this.concept}
                        inputProps={{ maxLength: 140 }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('amount')} variant="outlined" fullWidth size="small" inputRef={this.amount} type="number"
                        defaultValue={this.collectionOperation.pending} inputProps={{ min: 0 }} />
                </div>
                <div class="col" style={{ 'max-width': '15%', 'margin-top': '15px' }}>
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 175, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated);
                        }
                    },
                    { field: 'amount', headerName: i18next.t('amount'), width: 170 },
                    { field: 'concept', headerName: i18next.t('concept'), width: 250, flex: 1 },
                    {
                        field: "log", headerName: "Log", width: 100, renderCell: (params) => (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 16 }}
                                onClick={() => {
                                    this.transactionLog(params.row.id);
                                }}
                            >
                                Log
                            </Button>
                        ),
                    },
                    {
                        field: "delete", headerName: i18next.t('delete'), width: 100, renderCell: (params) => (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 16 }}
                                onClick={() => {
                                    ReactDOM.unmountComponentAtNode(document.getElementById('renderConfirmDelete'));
                                    ReactDOM.render(
                                        <ConfirmDelete
                                            onDelete={() => {
                                                this.deleteCharges(params.row.id).then((ok) => {
                                                    if (ok) {
                                                        this.renderCharges();
                                                    }
                                                });
                                            }}
                                        />,
                                        document.getElementById('renderConfirmDelete'));
                                }}
                            >
                                {i18next.t('delete')}
                            </Button>
                        ),
                    }
                ]}
            />
        </div>
    }
}

export default ChangesModal;
