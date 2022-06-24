/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import i18next from 'i18next';
import ReactDOM from 'react-dom';

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
import AlertModal from '../../AlertModal';

import { TextField } from "@material-ui/core";



class WarehouseModal extends Component {
    constructor({ addWarehouses }) {
        super();

        this.addWarehouse = addWarehouses;

        this.open = true;
        this.errorMessages = {};

        this.id = React.createRef();
        this.name = React.createRef();

        this.add = this.add.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getWarehouseFromForm() {
        const warehouse = {};
        warehouse.id = this.id.current.value;
        warehouse.name = this.name.current.value;
        return warehouse;
    }

    isValid(country) {
        this.errorMessages = {};
        if (country.name.length === 0) {
            this.errorMessages['name'] = i18next.t('name-0');
            this.forceUpdate();
            return false;
        }
        if (country.name.length > 50) {
            this.errorMessages['name'] = i18next.t('name-50');
            this.forceUpdate();
            return false;
        }
        if (country.id.length != 2) {
            this.errorMessages['id'] = i18next.t('id-must-2');
            this.forceUpdate();
            return false;
        }
        this.forceUpdate();
        return true;
    }

    add() {
        const warehouse = this.getWarehouseFromForm();
        if (!this.isValid(warehouse)) {
            return;
        }

        this.addWarehouse(warehouse).then((ok) => {
            if (ok) {
                this.handleClose();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('ERROR-CREATING')}
                    modalText={i18next.t('the-id-is-aleady-in-use')}
                />, this.refs.renderModal);
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
                {i18next.t('warehouse')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="renderModal"></div>
                <TextField label='ID' variant="outlined" fullWidth size="small" inputRef={this.id} inputProps={{ maxLength: 2 }}
                    error={this.errorMessages['id']} helperText={this.errorMessages['id']} />
                <br />
                <br />
                <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name} inputProps={{ maxLength: 50 }}
                    error={this.errorMessages['name']} helperText={this.errorMessages['name']} />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default WarehouseModal;
