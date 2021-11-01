import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ProductForm from "../../Masters/Products/ProductForm";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';

const saleOrderStates = {
    '_': 'waiting-for-payment',
    'A': 'waiting-for-purchase-order',
    'B': 'purchase-order-pending',
    'C': 'waiting-for-manufacturing-orders',
    'D': 'manufacturing-orders-pending',
    'E': 'sent-to-preparation',
    'F': 'awaiting-for-shipping',
    'G': 'shipped',
    'H': 'receiced-by-the-customer',
    'Z': 'cancelled'
}



class SalesOrderDetailsModal extends Component {
    constructor({ detail, orderId, findProductByName, getOrderDetailsDefaults, defaultValueNameProduct, addSalesOrderDetail,
        updateSalesOrderDetail, deleteSalesOrderDetail, waiting, locateProduct, cancelSalesOrderDetail, getPurchasesOrderDetailsFromSaleOrderDetail,
        getProductFunctions }) {
        super();

        this.detail = detail;
        this.orderId = orderId;
        this.findProductByName = findProductByName;

        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.addSalesOrderDetail = addSalesOrderDetail;
        this.updateSalesOrderDetail = updateSalesOrderDetail;
        this.deleteSalesOrderDetail = deleteSalesOrderDetail;
        this.waiting = waiting;
        this.locateProduct = locateProduct;
        this.cancelSalesOrderDetail = cancelSalesOrderDetail;
        this.getPurchasesOrderDetailsFromSaleOrderDetail = getPurchasesOrderDetailsFromSaleOrderDetail;
        this.getProductFunctions = getProductFunctions;

        this.currentSelectedProductId = detail != null ? detail.product : null;
        this.open = true;
        this.tab = 0;
        this.purchaseDetails = [];

        this.productDefaults = this.productDefaults.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.editProduct = this.editProduct.bind(this);
    }

    componentDidMount() {
        if (this.detail != null) {
            this.getPurchasesOrderDetailsFromSaleOrderDetail(this.detail.id).then((details) => {
                this.purchaseDetails = details;
            });
        }
    }

    productDefaults() {
        if (this.currentSelectedProductId == null) {
            this.refs.price.value = "0";
            this.refs.quantity.value = "1";
            this.refs.vatPercent.value = window.config.defaultVatPercent;
            this.calcTotalAmount();
        } else {
            this.getOrderDetailsDefaults(this.currentSelectedProductId).then((defaults) => {
                this.refs.price.value = defaults.price;
                this.refs.vatPercent.value = defaults.vatPercent;
                this.calcTotalAmount();
            });
        }
    }

    calcTotalAmount() {
        const price = parseFloat(this.refs.price.value);
        const quantity = parseInt(this.refs.quantity.value);
        const vatPercent = parseFloat(this.refs.vatPercent.value);

        this.refs.totalAmount.value = ((price * quantity) * (1 + (vatPercent / 100))).toFixed(6);
    }

    getOrderDetailFromForm() {
        const detail = {};
        detail.order = parseInt(this.orderId);
        detail.product = parseInt(this.currentSelectedProductId);
        detail.price = parseFloat(this.refs.price.value);
        detail.quantity = parseInt(this.refs.quantity.value);
        detail.vatPercent = parseFloat(this.refs.vatPercent.value);
        return detail;
    }

    add() {
        const detail = this.getOrderDetailFromForm();

        this.addSalesOrderDetail(detail).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const detail = this.getOrderDetailFromForm();
        detail.id = this.detail.id;

        this.updateSalesOrderDetail(detail).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteSalesOrderDetail(this.detail.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    cancel() {
        this.cancelSalesOrderDetail(this.detail.id);
        this.handleClose();
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

    locateProducts() {
        ReactDOM.unmountComponentAtNode(document.getElementById("salesOrderDetailsModal2"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.refs.productName.value = product.name;
                this.productDefaults();
            }}
        />, document.getElementById("salesOrderDetailsModal2"));
    }

    handleTabChange(_, tab) {
        this.tab = tab;
        this.forceUpdate();
    }

    async editProduct() {
        if (this.currentSelectedProductId == null) {
            return;
        }

        const commonProps = this.getProductFunctions();
        const product = await commonProps.getProductRow(this.currentSelectedProductId);

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitleProduct style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('product')}
            </this.DialogTitleProduct>
            <DialogContent>
                <ProductForm
                    {...commonProps}
                    tabProducts={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
                    product={product}
                />
            </DialogContent>
        </Dialog>, this.refs.render);
    }

    render() {
        return (<div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('sale-order-detail')}
                </this.DialogTitle>
                <DialogContent>
                    {this.detail == null || this.detail.purchaseOrderDetail == null ? null :
                        <AppBar position="static" style={{
                            'backgroundColor': '#343a40'
                        }}>
                            <Tabs value={this.tab} onChange={this.handleTabChange}>
                                <Tab label={i18next.t('details')} />
                                <Tab label={i18next.t('purchases')} />
                            </Tabs>
                        </AppBar>
                    }
                    <div role="tabpanel" hidden={this.tab !== 0}>
                        <label>{i18next.t('product')}</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                    disabled={this.detail != null && !this.waiting}><HighlightIcon /></button>
                            </div>
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.editProduct}><EditIcon /></button>
                            </div>
                            <input type="text" class="form-control" ref="productName" defaultValue={this.defaultValueNameProduct}
                                readOnly={true} style={{ 'width': '70%' }} />
                        </div>

                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('price')}</label>
                                <input type="number" class="form-control" ref="price" defaultValue={this.detail != null ? this.detail.price : '0'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('quantity')}</label>
                                <input type="number" class="form-control" ref="quantity"
                                    defaultValue={this.detail != null ? this.detail.quantity : '1'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('vat-percent')}</label>
                                <input type="number" class="form-control" ref="vatPercent"
                                    defaultValue={this.detail != null ? this.detail.vatPercent : window.config.defaultVatPercent}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('total-amount')}</label>
                                <input type="number" class="form-control" ref="totalAmount"
                                    defaultValue={this.detail != null ? this.detail.totalAmount : '0'}
                                    readOnly={true} />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <div class="form-row">
                                    <div class="col">
                                        <label>{i18next.t('invoice')}</label>
                                        <input type="text" class="form-control" readOnly={true}
                                            defaultValue={this.detail !== undefined ? (this.detail.quantityInvoiced === 0
                                                ? i18next.t('not-invoiced') :
                                                (this.detail.quantityInvoiced === this.detail.quantity ?
                                                    i18next.t('invoiced') : i18next.t('partially-invoiced'))) : ''} />
                                    </div>
                                    <div class="col">
                                        <label>{i18next.t('delivery-note')}</label>
                                        <input type="text" class="form-control" readOnly={true}
                                            defaultValue={this.detail !== undefined ? (this.detail.quantityDeliveryNote === 0 ?
                                                i18next.t('no-delivery-note') : (this.detail.quantityDeliveryNote === this.detail.quantity ?
                                                    i18next.t('delivery-note-generated') : i18next.t('partially-delivered'))) : ''}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <label>{i18next.t('status')}</label>
                                <input type="text" class="form-control"
                                    defaultValue={this.detail !== undefined ? i18next.t(saleOrderStates[this.detail.status]) : ''}
                                    readOnly={true} />
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" hidden={this.tab !== 1}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.purchaseDetails}
                            columns={[
                                { field: 'orderName', headerName: i18next.t('order-name'), width: 160 },
                                { field: 'supplierName', headerName: i18next.t('supplier'), flex: 1 },
                                {
                                    field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                        return window.dateFormat(params.row.dateCreated);
                                    }
                                },
                                { field: 'quantity', headerName: i18next.t('quantity'), width: 130 },
                                { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
                            ]}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    {this.detail != null && !this.detail.cancelled ? <button type="button" class="btn btn-warning"
                        onClick={this.cancel}>{i18next.t('cancel')}</button> : null}
                    {this.detail != null && this.detail.cancelled ? <button type="button" class="btn btn-warning"
                        onClick={this.cancel}>{i18next.t('uncancel')}</button> : null}
                    {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.detail != null && this.waiting ? <button type="button" class="btn btn-success"
                        onClick={this.update}>{i18next.t('update')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>);
    }
}



export default SalesOrderDetailsModal;
