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
import HighlightIcon from '@material-ui/icons/Highlight';



class PurchaseOrderDetails extends Component {
    constructor({ orderId, waiting, findProductByName, getOrderDetailsDefaults, getPurchaseOrderDetails, addPurchaseOrderDetail, updatePurchaseOrderDetail,
        getNameProduct, deletePurchaseOrderDetail, locateProduct }) {
        super();

        this.orderId = orderId;
        this.waiting = waiting;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseOrderDetails = getPurchaseOrderDetails;
        this.addPurchaseOrderDetail = addPurchaseOrderDetail;
        this.updatePurchaseOrderDetail = updatePurchaseOrderDetail;
        this.deletePurchaseOrderDetail = deletePurchaseOrderDetail;
        this.locateProduct = locateProduct;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.printPurchaseOrderDetails();
    }

    printPurchaseOrderDetails() {
        this.getPurchaseOrderDetails(this.orderId).then((details) => {
            this.renderPurchaseOrderDetails(details);
        });
    }

    async renderPurchaseOrderDetails(details) {
        this.list = details;
        this.forceUpdate();
    }

    add() {
        if (this.orderId == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseOrderDetailsModal'));
        ReactDOM.render(
            <PurchaseOrderDetailsModal
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                locateProduct={this.locateProduct}
                addPurchaseOrderDetail={(detail) => {
                    const promise = this.addPurchaseOrderDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printPurchaseOrderDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('purchaseOrderDetailsModal'));
    }

    async edit(detail) {
        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseOrderDetailsModal'));
        ReactDOM.render(
            <PurchaseOrderDetailsModal
                detail={detail}
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                locateProduct={this.locateProduct}
                defaultValueNameProduct={detail.productName}
                updatePurchaseOrderDetail={(detail) => {
                    const promise = this.updatePurchaseOrderDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printPurchaseOrderDetails();
                        }
                    });
                    return promise;
                }}
                deletePurchaseOrderDetail={(detailId) => {
                    const promise = this.deletePurchaseOrderDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printPurchaseOrderDetails();
                        }
                    });
                    return promise;
                }}
                waiting={this.waiting}
            />,
            document.getElementById('purchaseOrderDetailsModal'));
    }

    render() {
        return <div id="purchaseOrderDetails">
            <div id="purchaseOrderDetailsModal"></div>
            <div id="purchaseOrderDetailsModal2"></div>
            <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <div className="tableOverflowContainer">
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'id', headerName: '#', width: 90 },
                        { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                        { field: 'price', headerName: i18next.t('price'), width: 150 },
                        { field: 'quantity', headerName: i18next.t('quantity'), width: 150 },
                        { field: 'vatPercent', headerName: i18next.t('%-vat'), width: 150 },
                        { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 200 },
                        {
                            field: 'quantityInvoiced', headerName: i18next.t('invoice') + "/" + i18next.t('delivery-note'), width: 300,
                            valueGetter: (params) => {
                                return (params.row.quantityInvoiced === 0 ? i18next.t('not-invoiced') :
                                    (params.row.quantityInvoiced === params.row.quantity
                                        ? i18next.t('invoiced') : i18next.t('partially-invoiced')))
                                    + "/" +
                                    i18next.t(params.row.quantityDeliveryNote === 0 ? i18next.t('no-delivery-note') :
                                        (params.row.quantityDeliveryNote === params.row.quantity ?
                                            i18next.t('delivery-note-generated') : i18next.t('partially-delivered')))
                            }
                        }
                    ]}
                    onRowClick={(data) => {
                        this.edit(data.row);
                    }}
                />
            </div>
        </div>
    }
}

class PurchaseOrderDetailsModal extends Component {
    constructor({ detail, orderId, findProductByName, getOrderDetailsDefaults, defaultValueNameProduct, addPurchaseOrderDetail, updatePurchaseOrderDetail,
        deletePurchaseOrderDetail, waiting, locateProduct }) {
        super();

        this.detail = detail;
        this.orderId = orderId;
        this.findProductByName = findProductByName;

        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.addPurchaseOrderDetail = addPurchaseOrderDetail;
        this.updatePurchaseOrderDetail = updatePurchaseOrderDetail;
        this.deletePurchaseOrderDetail = deletePurchaseOrderDetail;
        this.waiting = waiting;
        this.locateProduct = locateProduct;

        this.currentSelectedProductId = detail != null ? detail.product : null;
        this.open = true;

        this.productDefaults = this.productDefaults.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
    }

    productDefaults() {
        if (this.currentSelectedProductId == null) {
            this.refs.price.value = "0";
            this.refs.quantity.value = "1";
            this.refs.vatPercent.value = "21";
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

    update() {
        const detail = this.getOrderDetailFromForm();
        detail.id = this.detail.id;

        this.updatePurchaseOrderDetail(detail).then((ok) => {
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

    render() {
        return (
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('purchase-order-detail')}
                </this.DialogTitle>
                <DialogContent>
                    <label>{i18next.t('product')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="productName" defaultValue={this.defaultValueNameProduct}
                            readOnly={true} style={{ 'width': '94%' }} />
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('price')}</label>
                            <input type="number" class="form-control" ref="price" defaultValue={this.detail != null ? this.detail.price : '0'}
                                onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('quantity')}</label>
                            <input type="number" class="form-control" ref="quantity" defaultValue={this.detail != null ? this.detail.quantity : '1'}
                                onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('vat-percent')}</label>
                            <input type="number" class="form-control" ref="vatPercent" defaultValue={this.detail != null ? this.detail.vatPercent : '21'}
                                onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-amount')}</label>
                            <input type="number" class="form-control" ref="totalAmount" defaultValue={this.detail != null ? this.detail.totalAmount : '0'}
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
                                            (this.detail.quantityDeliveryNote === this.detail.quantity ? 'Delivery note generated' : 'Partially delivered')) : ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.detail != null && this.waiting ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                </DialogActions>
            </Dialog>
        );
    }
}

export default PurchaseOrderDetails;
