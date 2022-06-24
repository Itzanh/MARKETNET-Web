/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
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
import AlertModal from "../../AlertModal";

import { TextField } from "@material-ui/core";



class ProductFamiliesModal extends Component {
    constructor({ productFamily, addProductFamilies, updateProductFamilies, deleteProductFamilies }) {
        super();

        this.productFamily = productFamily;

        this.addProductFamilies = addProductFamilies;
        this.updateProductFamilies = updateProductFamilies;
        this.deleteProductFamilies = deleteProductFamilies;

        this.open = true;
        this.errorMessages = {};

        this.name = React.createRef();
        this.reference = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getProductFamilyFromForm() {
        const productFamily = {}
        productFamily.name = this.name.current.value;
        productFamily.reference = this.reference.current.value;
        return productFamily;
    }

    isValid(productFamily) {
        this.errorMessages = {};
        if (productFamily.name.length === 0) {
            this.errorMessages['name'] = i18next.t('name-0');
            this.forceUpdate();
            return false;
        }
        if (productFamily.name.length > 100) {
            this.errorMessages['name'] = i18next.t('name-100');
            this.forceUpdate();
            return false;
        }
        if (productFamily.reference.length === 0) {
            this.errorMessages['reference'] = i18next.t('reference-0');
            this.forceUpdate();
            return false;
        }
        if (productFamily.reference.length > 100) {
            this.errorMessages['reference'] = i18next.t('reference-40');
            this.forceUpdate();
            return false;
        }
        this.forceUpdate();
        return true;
    }

    add() {
        const productFamily = this.getProductFamilyFromForm();
        if (!this.isValid(productFamily)) {
            return;
        }

        this.addProductFamilies(productFamily).then((ok) => {
            if (ok) {
                this.handleClose();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('ERROR-CREATING')}
                    modalText={i18next.t('the-product-family-reference-is-duplicated')}
                />, this.refs.renderModal);
            }
        });
    }

    update() {
        const productFamily = this.getProductFamilyFromForm();
        if (!this.isValid(productFamily)) {
            return;
        }
        productFamily.id = this.productFamily.id;

        this.updateProductFamilies(productFamily).then((ok) => {
            if (ok) {
                this.handleClose();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('ERROR-UPDATING')}
                    modalText={i18next.t('the-product-family-reference-is-duplicated')}
                />, this.refs.renderModal);
            }
        });
    }

    delete() {
        const productFamilyId = this.productFamily.id;
        this.deleteProductFamilies(productFamilyId).then((ok) => {
            if (ok) {
                this.handleClose();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('ERROR-DELETING')}
                    modalText={i18next.t('there-are-product-in-the-product-family')}
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
                {i18next.t('product-family')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="renderModal"></div>
                <div class="form-group">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.productFamily != null ? this.productFamily.name : ''} inputProps={{ maxLength: 100 }}
                        error={this.errorMessages['name']} helperText={this.errorMessages['name']} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('reference')} variant="outlined" fullWidth size="small" inputRef={this.reference}
                        defaultValue={this.productFamily != null ? this.productFamily.reference : ''} inputProps={{ maxLength: 40 }}
                        error={this.errorMessages['reference']} helperText={this.errorMessages['reference']} />
                </div>
            </DialogContent>
            <DialogActions>
                {this.productFamily != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.productFamily == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.productFamily != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default ProductFamiliesModal;
