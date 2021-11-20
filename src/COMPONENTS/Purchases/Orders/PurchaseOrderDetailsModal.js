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
import LocateProduct from "../../Masters/Products/LocateProduct";
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';
import ProductForm from "../../Masters/Products/ProductForm";
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";



class PurchaseOrderDetailsModal extends Component {
    constructor({ detail, orderId, findProductByName, getOrderDetailsDefaults, defaultValueNameProduct, addPurchaseOrderDetail,
        deletePurchaseOrderDetail, waiting, locateProduct, getSalesOrderDetailsFromPurchaseOrderDetail, getRegisterTransactionalLogs, getProductFunctions }) {
        super();

        this.detail = detail;
        this.orderId = orderId;
        this.findProductByName = findProductByName;

        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.addPurchaseOrderDetail = addPurchaseOrderDetail;
        this.deletePurchaseOrderDetail = deletePurchaseOrderDetail;
        this.waiting = waiting;
        this.locateProduct = locateProduct;
        this.getSalesOrderDetailsFromPurchaseOrderDetail = getSalesOrderDetailsFromPurchaseOrderDetail;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getProductFunctions = getProductFunctions;

        this.currentSelectedProductId = detail != null ? detail.product : null;
        this.open = true;
        this.tab = 0;
        this.salesDetails = [];

        this.productDefaults = this.productDefaults.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    componentDidMount() {
        if (this.detail != null) {
            this.getSalesOrderDetailsFromPurchaseOrderDetail(this.detail.id).then((details) => {
                this.salesDetails = details;
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

        this.addPurchaseOrderDetail(detail).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deletePurchaseOrderDetail(this.detail.id).then((ok) => {
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
        ReactDOM.unmountComponentAtNode(document.getElementById("purchaseOrderDetailsModal2"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.refs.productName.value = product.name;
                this.productDefaults();
            }}
        />, document.getElementById("purchaseOrderDetailsModal2"));
    }

    transactionLog() {
        if (this.detail == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseOrderDetailsModal2'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"purchase_order_detail"}
            registerId={this.detail.id}
        />,
            document.getElementById('purchaseOrderDetailsModal2'));
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
                    {i18next.t('purchase-order-detail')}
                </this.DialogTitle>
                <DialogContent>
                    <AppBar position="static" style={{
                        'backgroundColor': '#343a40'
                    }}>
                        <Tabs value={this.tab} onChange={this.handleTabChange}>
                            <Tab label={i18next.t('details')} />
                            <Tab label={i18next.t('sales')} />
                        </Tabs>
                    </AppBar>
                    <div role="tabpanel" hidden={this.tab !== 0}>
                        <label>{i18next.t('product')}</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}><HighlightIcon /></button>
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
                                            defaultValue={this.detail !== undefined ? (this.detail.quantityInvoiced === 0 ? 'Not invoiced' :
                                                (this.detail.quantityInvoiced === this.detail.quantity ? 'Invoiced' : 'Partially invoiced')) : ''} />
                                    </div>
                                    <div class="col">
                                        <label>{i18next.t('delivery-note')}</label>
                                        <input type="text" class="form-control" readOnly={true}
                                            defaultValue={this.detail !== undefined ? (this.detail.quantityDeliveryNote === 0 ? 'No delivery note' :
                                                (this.detail.quantityDeliveryNote === this.detail.quantity
                                                    ? 'Delivery note generated' : 'Partially delivered')) : ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" hidden={this.tab !== 1}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.salesDetails}
                            columns={[
                                { field: 'orderName', headerName: i18next.t('order-name'), width: 160 },
                                { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
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
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            {this.detail != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>
                    {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>);
    }
}



export default PurchaseOrderDetailsModal;
