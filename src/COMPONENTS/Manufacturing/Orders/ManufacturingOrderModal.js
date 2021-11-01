import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import AutocompleteField from "../../AutocompleteField";

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
import ManufacturingOrderType from "../OrderTypes/ManufacturingOrderType";




class ManufacturingOrderModal extends Component {
    constructor({ order, addManufacturingOrder, findProductByName, defaultValueNameProduct, getManufacturingOrderTypes, toggleManufactuedManufacturingOrder,
        deleteManufacturingOrder, getProductRow, manufacturingOrderTagPrinted }) {
        super();

        this.order = order;
        this.addManufacturingOrder = addManufacturingOrder;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.toggleManufactuedManufacturingOrder = toggleManufactuedManufacturingOrder;
        this.deleteManufacturingOrder = deleteManufacturingOrder;
        this.getProductRow = getProductRow;
        this.manufacturingOrderTagPrinted = manufacturingOrderTagPrinted;

        this.currentSelectedProductId = this.order != null ? this.order.product : null;
        this.open = true;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.printTags = this.printTags.bind(this);
        this.printTagManufacturing = this.printTagManufacturing.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderOrderTypes = this.renderOrderTypes.bind(this);
    }

    componentDidMount() {
        setTimeout(this.renderOrderTypes, 100);
    }

    renderOrderTypes() {
        if (this.order == null) {
            this.getManufacturingOrderTypes().then((types) => {
                types.unshift({ id: 0, name: ".Any" });
                ReactDOM.render(types.map((element, i) => {
                    return <ManufacturingOrderType key={i}
                        type={element}
                    />
                }), this.refs.renderTypes);
            });
        } else {
            ReactDOM.render(<ManufacturingOrderType
                type={{ id: this.order.type, name: this.order.typeName }}
            />, this.refs.renderTypes);
        }
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getManufacturingOrderFromForm() {
        const order = {};
        order.product = parseInt(this.currentSelectedProductId);
        order.type = parseInt(this.refs.renderTypes.value);
        return order;
    }

    isValid(order) {
        this.refs.errorMessage.innerText = "";
        if (order.product === null || order.product === 0 || isNaN(order.product)) {
            this.refs.errorMessage.innerText = i18next.t('must-product');
            return false;
        }
        if (order.type === 0) {
            this.refs.errorMessage.innerText = i18next.t('must-order-type');
            return false;
        }
        return true;
    }

    add() {
        const order = this.getManufacturingOrderFromForm();
        if (!this.isValid(order)) {
            return;
        }

        this.addManufacturingOrder(order).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        this.toggleManufactuedManufacturingOrder(this.order.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteManufacturingOrder(this.order.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    async printTags() {
        const product = await this.getProductRow(this.order.product);
        window.open("marketnettagprinter:\\\\copies=1&barcode=ean13&data=" + product.barCode.substring(0, 12));
        this.manufacturingOrderTagPrinted(this.order.id);
    }

    printTagManufacturing() {
        window.open("marketnettagprinter:\\\\copies=1&barcode=datamatrix&data=" + this.order.uuid);
        this.manufacturingOrderTagPrinted(this.order.id);
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('manufacturing-order')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>{i18next.t('product')}</label>
                    <AutocompleteField findByName={this.findProductByName} defaultValueId={this.order != null ? this.order.product : null}
                        defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                            this.currentSelectedProductId = value;
                        }} disabled={this.order != null} />
                    <label>{i18next.t('type')}</label>
                    <select class="form-control" ref="renderTypes" disabled={this.order != null}>
                    </select>
                </div>
                <div class="form-row">
                    <div class="col">
                        <label>User created</label>
                        <input type="text" class="form-control" readOnly={true}
                            defaultValue={this.order != null ? this.order.userCreatedName : null} />
                    </div>
                    <div class="col">
                        <label>User manufactured</label>
                        <input type="text" class="form-control" readOnly={true}
                            defaultValue={this.order != null ? this.order.userManufacturedName : null} />
                    </div>
                    <div class="col">
                        <label>User that printed the tag</label>
                        <input type="text" class="form-control" readOnly={true}
                            defaultValue={this.order != null ? this.order.userTagPrintedName : null} />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.order != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.order == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.order != null && !this.order.manufactured ?
                    <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('manufactured')}</button> : null}
                {this.order != null && this.order.manufactured ?
                    <button type="button" class="btn btn-danger" onClick={this.update}>{i18next.t('undo-manufactured')}</button> : null}
                {this.order != null && this.order.manufactured ?
                    <button type="button" class="btn btn-primary" onClick={this.printTags}>{i18next.t('print-barcode')}</button> : null}
                {this.order != null && this.order.manufactured ?
                    <button type="button" class="btn btn-primary" onClick={this.printTagManufacturing}>{i18next.t('print-datamatrix')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}



export default ManufacturingOrderModal;
