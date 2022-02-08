import React, { Component } from "react";
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
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import ManufacturingOrderType from "../OrderTypes/ManufacturingOrderType";
import LocateProduct from "../../Masters/Products/LocateProduct";
import Grow from '@mui/material/Grow';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";
import AlertModal from "../../AlertModal";
import WindowRequestData from "../../WindowRequestData";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow direction="up" ref={ref} {...props} />;
});



class ManufacturingOrderModal extends Component {
    constructor({ order, addManufacturingOrder, addMultipleManufacturingOrder, findProductByName, defaultValueNameProduct, getManufacturingOrderTypes,
        toggleManufactuedManufacturingOrder, deleteManufacturingOrder, getProductRow, manufacturingOrderTagPrinted, locateProduct,
        getRegisterTransactionalLogs, preSelectProductId, preSelectProductName, preSelectManufacturingOrdeTypeId }) {
        super();

        this.order = order;
        this.addManufacturingOrder = addManufacturingOrder;
        this.addMultipleManufacturingOrder = addMultipleManufacturingOrder;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.toggleManufactuedManufacturingOrder = toggleManufactuedManufacturingOrder;
        this.deleteManufacturingOrder = deleteManufacturingOrder;
        this.getProductRow = getProductRow;
        this.manufacturingOrderTagPrinted = manufacturingOrderTagPrinted;
        this.locateProduct = locateProduct;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.currentSelectedProductId = this.order != null ? this.order.product : preSelectProductId;
        this.open = true;

        if (preSelectProductName != null) {
            this.defaultValueNameProduct = preSelectProductName;
        }

        this.preSelectManufacturingOrdeTypeId = preSelectManufacturingOrdeTypeId;

        this.productName = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.printTags = this.printTags.bind(this);
        this.printTagManufacturing = this.printTagManufacturing.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderOrderTypes = this.renderOrderTypes.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
        this.addMultiple = this.addMultiple.bind(this);
    }

    componentDidMount() {
        setTimeout(this.renderOrderTypes, 100);
    }

    renderOrderTypes() {
        if (this.order == null) {
            this.getManufacturingOrderTypes().then((types) => {
                types = types.filter((element) => { return !element.complex });
                types.unshift({ id: 0, name: ".Any" });
                ReactDOM.render(types.map((element, i) => {
                    return <ManufacturingOrderType key={i}
                        type={element}
                    />
                }), document.getElementById("renderTypes"));

                if (this.preSelectManufacturingOrdeTypeId != null) {
                    document.getElementById("renderTypes").value = this.preSelectManufacturingOrdeTypeId;
                    document.getElementById("renderTypes").disabled = true;
                }
            });
        } else {
            ReactDOM.render(<ManufacturingOrderType
                type={{ id: this.order.type, name: this.order.typeName }}
            />, document.getElementById("renderTypes"));
        }
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getManufacturingOrderFromForm() {
        const order = {};
        order.product = parseInt(this.currentSelectedProductId);
        order.type = parseInt(document.getElementById("renderTypes").value);
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
            } else if (this.order.manufactured && !ok) {
                ReactDOM.unmountComponentAtNode(document.getElementById("locateProductModal"));
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('cant-undo')}
                    modalText={i18next.t('undoing-this-manufacturing-order-is-not-permitted')}
                />, document.getElementById("locateProductModal"));
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

    locateProducts() {
        ReactDOM.unmountComponentAtNode(document.getElementById("locateProductModal"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.productName.current.value = product.name;
            }}
        />, document.getElementById("locateProductModal"));
    }

    transactionLog() {
        if (this.order == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('locateProductModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"manufacturing_order"}
            registerId={this.order.id}
        />,
            document.getElementById('locateProductModal'));
    }

    addMultiple() {
        const manufaturingOrder = this.getManufacturingOrderFromForm();
        if (!this.isValid(manufaturingOrder)) {
            return;
        }
        const order = {};
        order.order = manufaturingOrder;

        ReactDOM.unmountComponentAtNode(document.getElementById("locateProductModal"));
        ReactDOM.render(<WindowRequestData
            modalTitle={i18next.t('input-quantity')}
            modalText={i18next.t('input-the-quantity-of-manufacturing-orders-to-generate')}
            dataType="number"
            min="1"
            max="10000"
            defaultValue="1"
            onDataInput={(quantity) => {
                order.quantity = parseInt(quantity);
                this.addMultipleManufacturingOrder(order).then((ok) => {
                    if (ok) {
                        this.handleClose();
                    }
                });
            }}
        />, document.getElementById("locateProductModal"));
    }

    render() {
        return <div>
            <div id="locateProductModal"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('manufacturing-order')}
                </this.DialogTitle>
                <DialogContent>
                    <div class="form-group">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                    disabled={this.order != null}><HighlightIcon /></button>
                            </div>
                            <TextField label={i18next.t('product')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                                inputRef={this.productName} defaultValue={this.defaultValueNameProduct} />
                        </div>
                        <br />
                        <FormControl fullWidth>
                            <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('type')}</InputLabel>
                            <NativeSelect
                                style={{ 'marginTop': '0' }}
                                id="renderTypes"
                                disabled={this.order != null}>

                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div class="form-row mt-3">
                        <div class="col">
                            <TextField label={i18next.t('user-created')} variant="outlined" fullWidth size="small"
                                defaultValue={this.order != null ? this.order.userCreatedName : null} InputProps={{ readOnly: true }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('user-manufactured')} variant="outlined" fullWidth size="small"
                                defaultValue={this.order != null ? this.order.userManufacturedName : null} InputProps={{ readOnly: true }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('user-that-printed-the-tag')} variant="outlined" fullWidth size="small"
                                defaultValue={this.order != null ? this.order.userTagPrintedName : null} InputProps={{ readOnly: true }} />
                        </div>
                    </div>
                    <br />
                </DialogContent>
                <DialogActions>
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            {this.order != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>

                    <p className="errorMessage" ref="errorMessage"></p>
                    {this.order != null && !window.getPermission("CANT_DELETE_MANUFACTURING_ORDERS") ?
                        <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.order == null ? <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                        <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                        <div class="btn-group" role="group">
                            <button id="btnGroupDrop1" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            </button>
                            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                <a class="dropdown-item" href="#" onClick={this.addMultiple}>{i18next.t('add-multiple')}</a>
                            </div>
                        </div>
                    </div> : null}
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
        </div>
    }
}



export default ManufacturingOrderModal;
