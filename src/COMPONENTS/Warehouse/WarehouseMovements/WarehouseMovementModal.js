import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import LocateProduct from "../../Masters/Products/LocateProduct";
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import HighlightIcon from '@material-ui/icons/Highlight';

import AutocompleteField from "../../AutocompleteField";

class WarehouseMovementModal extends Component {
    constructor({ movement, findProductByName, defaultValueNameProduct, findWarehouseByName, defaultValueNameWarehouse, addWarehouseMovements,
        deleteWarehouseMovements, defaultType, locateProduct }) {
        super();

        this.movement = movement;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.findWarehouseByName = findWarehouseByName;
        this.defaultValueNameWarehouse = defaultValueNameWarehouse;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.defaultType = defaultType;
        this.locateProduct = locateProduct;

        this.currentSelectedProductId = movement != null ? movement.product : 0;
        this.currentSelectedWarehouseId = movement != null ? movement.warehouse : 0;
        this.open = true;

        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
    }

    getWarehouseMovementFromForm() {
        const movement = {};
        movement.warehouse = this.currentSelectedWarehouseId;
        movement.product = parseInt(this.currentSelectedProductId);
        movement.quantity = parseInt(this.refs.quantity.value);
        movement.type = this.refs.type.value;
        movement.price = parseFloat(this.refs.price.value);
        movement.vatPercent = parseFloat(this.refs.vatPercent.value);
        if (movement.type === "O") {
            movement.quantity = -movement.quantity;
        }
        return movement;
    }

    isValid(movement) {
        this.refs.errorMessage.innerText = "";
        if (movement.product === 0 || isNaN(movement.product) || movement.product === null) {
            this.refs.errorMessage.innerText = i18next.t('must-product"');
            return false;
        }
        if (movement.quantity === 0) {
            this.refs.errorMessage.innerText = i18next.t('quantity-0');
            return false;
        }
        if (movement.warehouse === null || movement.warehouse === "") {
            this.refs.errorMessage.innerText = i18next.t('no-warehouse');
            return false;
        }
        return true;
    }

    add() {
        const movement = this.getWarehouseMovementFromForm();
        if (!this.isValid(movement)) {
            return;
        }

        this.addWarehouseMovements(movement).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteWarehouseMovements(this.movement.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
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

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    locateProducts() {
        ReactDOM.unmountComponentAtNode(document.getElementById("warehouseMovementModal"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.refs.productName.value = product.name;
            }}
        />, document.getElementById("warehouseMovementModal"));
    }

    calcTotalAmount() {
        const price = parseFloat(this.refs.price.value);
        const quantity = parseInt(this.refs.quantity.value);
        const vatPercent = parseFloat(this.refs.vatPercent.value);

        this.refs.totalAmount.value = ((price * quantity) * (1 + (vatPercent / 100))).toFixed(6);
    }

    render() {
        return (
            <div>
                <div id="warehouseMovementModal"></div>
                <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                    PaperComponent={this.PaperComponent}>
                    <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        {i18next.t('warehouse-movement')}
                    </this.DialogTitle>
                    <DialogContent>
                        <label>{i18next.t('product')}</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                    disabled={this.movement != undefined}><HighlightIcon /></button>
                            </div>
                            <input type="text" class="form-control" ref="productName" defaultValue={this.defaultValueNameProduct}
                                readOnly={true} style={{ 'width': '94%' }} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('quantity')}</label>
                                <input type="number" class="form-control" ref="quantity" defaultValue={this.movement !== undefined ? this.movement.quantity : 0}
                                    disabled={this.movement != null} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('type')}</label>
                                <select class="form-control" ref="type" disabled={this.movement !== undefined || this.defaultType !== undefined}
                                    defaultValue={this.movement != null ? this.movement.type : this.defaultType}>
                                    <option value="I" selected={this.defaultType === "I"}>{i18next.t('in')}</option>
                                    <option value="O" selected={this.defaultType === "O"}>{i18next.t('out')}</option>
                                    <option value="R" selected={this.defaultType === "R"}>{i18next.t('inventory-regularization')}</option>
                                </select>
                            </div>
                            <div class="col">
                                <label>{i18next.t('warehouse')}</label>
                                <AutocompleteField findByName={this.findWarehouseByName} defaultValueId={this.movement != null ? this.movement.warehouse : null}
                                    defaultValueName={this.defaultValueNameWarehouse != null ? this.defaultValueNameWarehouse : this.movement.warehouseName}
                                    valueChanged={(value) => {
                                        this.currentSelectedWarehouseId = value;
                                    }} disabled={this.movement !== undefined || this.defaultType !== undefined} />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('price')}</label>
                                <input type="number" class="form-control" ref="price" defaultValue={this.movement != null ? this.movement.price : '0'}
                                    onChange={this.calcTotalAmount} readOnly={this.movement != null} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('vat-percent')}</label>
                                <input type="number" class="form-control" ref="vatPercent"
                                    defaultValue={this.movement != null ? this.movement.vatPercent : window.config.defaultVatPercent}
                                    onChange={this.calcTotalAmount} readOnly={this.movement != null} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('total-amount')}</label>
                                <input type="number" class="form-control" ref="totalAmount"
                                    defaultValue={this.movement != null ? this.movement.totalAmount : '0'}
                                    readOnly={true} />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.movement != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                        {this.movement == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default WarehouseMovementModal;
