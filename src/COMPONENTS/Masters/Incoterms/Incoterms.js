/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
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



class Incoterms extends Component {
    constructor({ getIncoterms, addIncoterms, updateIncoterms, deleteIncoterms }) {
        super();

        this.getIncoterms = getIncoterms;
        this.addIncoterms = addIncoterms;
        this.updateIncoterms = updateIncoterms;
        this.deleteIncoterms = deleteIncoterms;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderIncoterm();
    }

    renderIncoterm() {
        this.getIncoterms().then((series) => {
            this.list = series;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderIncotermsModal'));
        ReactDOM.render(
            <IncotermModal
                addIncoterms={(incoterm) => {
                    const promise = this.addIncoterms(incoterm);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderIncoterm();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderIncotermsModal'));
    }

    edit(incoterm) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderIncotermsModal'));
        ReactDOM.render(
            <IncotermModal
                incoterm={incoterm}
                updateIncoterms={(incoterm) => {
                    const promise = this.updateIncoterms(incoterm);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderIncoterm();
                        }
                    });
                    return promise;
                }}
                deleteIncoterms={(incotermId) => {
                    const promise = this.deleteIncoterms(incotermId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderIncoterm();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderIncotermsModal'));
    }

    render() {
        return <div id="tabIncoterms">
            <div id="renderIncotermsModal"></div>
            <h4 className="ml-2">Incoterms</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'key', headerName: i18next.t('key'), width: 300 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class IncotermModal extends Component {
    constructor({ incoterm, addIncoterms, updateIncoterms, deleteIncoterms }) {
        super();

        this.incoterm = incoterm;
        this.addIncoterms = addIncoterms;
        this.updateIncoterms = updateIncoterms;
        this.deleteIncoterms = deleteIncoterms;

        this.open = true;
        this.errorMessages = {};

        this.key = React.createRef();
        this.name = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getIncotermFromForm() {
        const incoterm = {};
        incoterm.key = this.key.current.value;
        incoterm.name = this.name.current.value;
        return incoterm;
    }

    isValid(incoterm) {
        this.errorMessages = {};
        if (incoterm.name.length === 0) {
            this.errorMessages['name'] = i18next.t('name-0');
            this.forceUpdate();
            return false;
        }
        if (incoterm.name.length > 75) {
            this.errorMessages['name'] = i18next.t('name-75');
            this.forceUpdate();
            return false;
        }
        if (incoterm.key.length === 0) {
            this.errorMessages['key'] = i18next.t('key-0');
            this.forceUpdate();
            return false;
        }
        if (incoterm.key.length > 3) {
            this.errorMessages['key'] = i18next.t('key-3');
            this.forceUpdate();
            return false;
        }
        this.forceUpdate();
        return true;
    }

    add() {
        const incoterm = this.getIncotermFromForm();
        if (!this.isValid(incoterm)) {
            return;
        }

        this.addIncoterms(incoterm).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const incoterm = this.getIncotermFromForm();
        if (!this.isValid(incoterm)) {
            return;
        }
        incoterm.id = this.incoterm.id;

        this.updateIncoterms(incoterm).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteIncoterms(this.incoterm.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
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

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Incoterm
            </this.DialogTitle>
            <DialogContent>
                <TextField label={i18next.t('key')} variant="outlined" fullWidth size="small" inputRef={this.key}
                    defaultValue={this.incoterm != null ? this.incoterm.key : ''} inputProps={{ maxLength: 3 }}
                    error={this.errorMessages['key']} helperText={this.errorMessages['key']} />
                <br />
                <br />
                <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                    defaultValue={this.incoterm != null ? this.incoterm.name : ''} inputProps={{ maxLength: 50 }}
                    error={this.errorMessages['name']} helperText={this.errorMessages['name']} />
            </DialogContent>
            <DialogActions>
                {this.incoterm != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.incoterm == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.incoterm != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
};



export default Incoterms;
