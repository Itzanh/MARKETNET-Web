/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

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
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";
import SalesOrderDetailDigitalProductData from "./SalesOrderDetailDigitalProductData";
import Grow from '@mui/material/Grow';
import { TextField } from "@material-ui/core";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';
import AlertModal from "../../AlertModal";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow direction="up" ref={ref} {...props} />;
});

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
        getRegisterTransactionalLogs, getSalesOrderDetailDigitalProductData, insertSalesOrderDetailDigitalProductData,
        updateSalesOrderDetailDigitalProductData, deleteSalesOrderDetailDigitalProductData, setDigitalSalesOrderDetailAsSent, customerId, customer,
        getProductFunctions, getProductIncludedProductSalesOrderDetail }) {
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
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getSalesOrderDetailDigitalProductData = getSalesOrderDetailDigitalProductData;
        this.insertSalesOrderDetailDigitalProductData = insertSalesOrderDetailDigitalProductData;
        this.updateSalesOrderDetailDigitalProductData = updateSalesOrderDetailDigitalProductData;
        this.deleteSalesOrderDetailDigitalProductData = deleteSalesOrderDetailDigitalProductData;
        this.setDigitalSalesOrderDetailAsSent = setDigitalSalesOrderDetailAsSent;
        this.customerId = customerId;
        this.customer = customer;
        this.getProductFunctions = getProductFunctions;
        this.getProductIncludedProductSalesOrderDetail = getProductIncludedProductSalesOrderDetail;

        this.currentSelectedProductId = detail != null ? detail.productId : 0;
        this.open = true;
        this.tab = 0;
        this.purchaseDetails = [];
        this.includedProducts = [];

        this.productName = React.createRef();
        this.price = React.createRef();
        this.quantity = React.createRef();
        this.vatPercent = React.createRef();
        this.totalAmount = React.createRef();

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
        this.transactionLog = this.transactionLog.bind(this);
        this.digitalProductData = this.digitalProductData.bind(this);
    }

    componentDidMount() {
        if (this.detail != null) {
            this.getPurchasesOrderDetailsFromSaleOrderDetail(this.detail.id).then((details) => {
                this.purchaseDetails = details;

                this.getProductIncludedProductSalesOrderDetail(this.detail.id).then((includedProducts) => {
                    this.includedProducts = includedProducts;
                });
            });
        }
    }

    productDefaults() {
        if (this.currentSelectedProductId == null) {
            this.price.current.value = "0";
            this.quantity.current.value = "1";
            this.vatPercent.current.value = window.config.defaultVatPercent;
            this.calcTotalAmount();
        } else {
            this.getOrderDetailsDefaults(this.currentSelectedProductId).then((defaults) => {
                this.price.current.value = defaults.price;
                this.vatPercent.current.value = defaults.vatPercent;
                this.calcTotalAmount();
            });
        }
    }

    calcTotalAmount() {
        const price = parseFloat(this.price.current.value);
        const quantity = parseInt(this.quantity.current.value);
        const vatPercent = parseFloat(this.vatPercent.current.value);

        this.totalAmount.current.value = ((price * quantity) * (1 + (vatPercent / 100))).toFixed(6);
    }

    getOrderDetailFromForm() {
        const detail = {};
        detail.orderId = parseInt(this.orderId);
        detail.productId = parseInt(this.currentSelectedProductId);
        detail.price = parseFloat(this.price.current.value);
        detail.quantity = parseInt(this.quantity.current.value);
        detail.vatPercent = parseFloat(this.vatPercent.current.value);
        return detail;
    }

    add() {
        const detail = this.getOrderDetailFromForm();

        if (detail.productId == 0 || detail.productId == null) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-must-specify-a-product')}
            />, this.refs.render);
            return;
        }

        this.addSalesOrderDetail(detail).then((ok) => {
            if (ok.ok) {
                this.handleClose();
            } else {
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('the-selected-product-is-deactivated')}
                        />, this.refs.render);
                        break;
                    }
                    case 2: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('there-is-aleady-a-detail-with-this-product')}
                        />, this.refs.render);
                        break;
                    }
                    default: // 0
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, this.refs.render);
                }
            }
        });
    }

    update() {
        const detail = this.getOrderDetailFromForm();
        detail.id = this.detail.id;

        this.updateSalesOrderDetail(detail).then((ok) => {
            if (ok.ok) {
                this.handleClose();
            } else {
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPDATING')}
                            modalText={i18next.t('the-selected-product-is-deactivated')}
                        />, this.refs.render);
                        break;
                    }
                    case 2: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPDATING')}
                            modalText={i18next.t('there-is-aleady-a-detail-with-this-product')}
                        />, this.refs.render);
                        break;
                    }
                    case 3: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPDATING')}
                            modalText={i18next.t('cant-update-an-invoiced-sale-order-detail')}
                        />, this.refs.render);
                        break;
                    }
                    default: // 0
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPDATING')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, this.refs.render);
                }
            }
        });
    }

    delete() {
        this.deleteSalesOrderDetail(this.detail.id).then((ok) => {
            if (ok.ok) {
                this.handleClose();
            } else {
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('the-detail-is-already-invoiced')}
                        />, this.refs.render);
                        break;
                    }
                    case 2: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('the-detail-has-a-delivery-note-generated')}
                        />, this.refs.render);
                        break;
                    }
                    case 3: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('there-are-complex-manufacturing-orders-already-created')}
                        />, this.refs.render);
                        break;
                    }
                    case 4: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('there-are-manufacturing-orders-already-created')}
                        />, this.refs.render);
                        break;
                    }
                    case 5: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('there-is-digital-product-data-that-must-be-deleted-first')}
                        />, this.refs.render);
                        break;
                    }
                    case 6: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('the-product-has-been-packaged')}
                        />, this.refs.render);
                        break;
                    }
                    case 7: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('this-detail-holds-the-included-product-for-another-detail')}
                        />, this.refs.render);
                        break;
                    }
                    default: // 0
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, this.refs.render);
                }
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
                this.productName.current.value = product.name;
                this.productDefaults();
            }}
        />, document.getElementById("salesOrderDetailsModal2"));
    }

    transactionLog() {
        if (this.detail == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDetailsModal2'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"sales_order_detail"}
            registerId={this.detail.id}
        />,
            document.getElementById('salesOrderDetailsModal2'));
    }

    digitalProductData() {
        if (this.detail == null || this.detail.digitalProduct == false) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDetailsModal2'));
        ReactDOM.render(<SalesOrderDetailDigitalProductData
            detailId={this.detail.id}
            getSalesOrderDetailDigitalProductData={this.getSalesOrderDetailDigitalProductData}
            insertSalesOrderDetailDigitalProductData={this.insertSalesOrderDetailDigitalProductData}
            updateSalesOrderDetailDigitalProductData={this.updateSalesOrderDetailDigitalProductData}
            deleteSalesOrderDetailDigitalProductData={this.deleteSalesOrderDetailDigitalProductData}
            setDigitalSalesOrderDetailAsSent={this.setDigitalSalesOrderDetailAsSent}
            customerId={this.customerId}
            customer={this.customer}
            dataSent={this.detail.status == "G"}
        />,
            document.getElementById('salesOrderDetailsModal2'));
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
                PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
                <this.DialogTitle style={this.detail != null && this.detail.cancelled ?
                    { cursor: 'move', 'backgroundColor': '#dc3545', 'color': 'white' } :
                    { cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('sale-order-detail')}
                </this.DialogTitle>
                <DialogContent>
                    {this.detail == null || (this.detail.purchaseOrderDetail == null && !this.detail.includedProducts) ? null :
                        <AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
                            <Tabs value={this.tab} onChange={this.handleTabChange}>
                                <Tab label={i18next.t('details')} />
                                <Tab label={i18next.t('purchases')} disabled={this.detail.purchaseOrderDetail == null} />
                                <Tab label={i18next.t('included-products')} disabled={!this.detail.includedProducts} />
                            </Tabs>
                        </AppBar>
                    }
                    <div role="tabpanel" hidden={this.tab !== 0}>
                        <br />
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                    disabled={this.detail != null && !this.waiting}><HighlightIcon /></button>
                            </div>
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.editProduct}><EditIcon /></button>
                            </div>
                            <TextField label={i18next.t('product')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                                inputRef={this.productName} defaultValue={this.defaultValueNameProduct} />
                        </div>
                        <div class="form-row mt-3">
                            <div class="col">
                                <TextField id="price" inputRef={this.price} label={i18next.t('price')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.detail != null ? this.detail.price : '0'} type="number"
                                    onChange={this.calcTotalAmount} InputProps={{ readOnly: this.detail != null && !this.waiting, inputProps: { min: 0 } }} />
                            </div>
                            <div class="col">
                                <TextField id="quantity" inputRef={this.quantity} label={i18next.t('quantity')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.detail != null ? this.detail.quantity : '1'} type="number"
                                    onChange={this.calcTotalAmount} InputProps={{ readOnly: this.detail != null && !this.waiting, inputProps: { min: 1 } }} />
                            </div>
                            <div class="col">
                                <TextField id="vatPercent" inputRef={this.vatPercent} label={i18next.t('vat-percent')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.detail != null ? this.detail.vatPercent : window.config.defaultVatPercent} type="number"
                                    onChange={this.calcTotalAmount} InputProps={{ readOnly: this.detail != null && !this.waiting, inputProps: { min: 0 } }} />
                            </div>
                            <div class="col">
                                <TextField id="totalAmount" inputRef={this.totalAmount} label={i18next.t('total-amount')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.detail != null ? this.detail.totalAmount : '0'} type="number" InputProps={{ readOnly: true }} />
                            </div>
                        </div>
                        <div class="form-row mt-3">
                            <div class="col">
                                <div class="form-row">
                                    <div class="col">
                                        <TextField label={i18next.t('invoice')}
                                            variant="outlined" fullWidth size="small" InputProps={{ readOnly: true }}
                                            defaultValue={this.detail !== undefined ? (this.detail.quantityInvoiced === 0
                                                ? i18next.t('not-invoiced') :
                                                (this.detail.quantityInvoiced === this.detail.quantity ?
                                                    i18next.t('invoiced') : i18next.t('partially-invoiced'))) : i18next.t('not-invoiced')} />
                                    </div>
                                    <div class="col">
                                        <TextField label={i18next.t('delivery-note')}
                                            variant="outlined" fullWidth size="small" InputProps={{ readOnly: true }}
                                            defaultValue={this.detail !== undefined ? (this.detail.quantityDeliveryNote === 0 ?
                                                i18next.t('no-delivery-note') : (this.detail.quantityDeliveryNote === this.detail.quantity ?
                                                    i18next.t('delivery-note-generated') : i18next.t('partially-delivered'))) : i18next.t('no-delivery-note')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <TextField label={i18next.t('status')}
                                    variant="outlined" fullWidth size="small" InputProps={{ readOnly: true }}
                                    defaultValue={this.detail !== undefined ? i18next.t(saleOrderStates[this.detail.status]) : ''}
                                />
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
                    <div role="tabpanel" hidden={this.tab !== 2}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.includedProducts}
                            columns={[
                                {
                                    field: 'originProduct', headerName: i18next.t('origin-product'), flex: 1, valueGetter: (params) => {
                                        return params.row.productIncludedProduct.productBase.name;
                                    }
                                },
                                { field: 'quantityUnit', headerName: i18next.t('quantity-unit'), width: 250 },
                            ]}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    {this.detail != null && this.detail.product != null && this.detail.product.digitalProduct
                        && (this.detail.status == "E" || this.detail.status == "G")
                        ? <button type="button" class="btn btn-info" onClick={this.digitalProductData}>{i18next.t('digital-product-data')}</button> : null}
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            {this.detail != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>
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
