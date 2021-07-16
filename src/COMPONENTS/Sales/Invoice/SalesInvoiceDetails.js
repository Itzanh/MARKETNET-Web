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



class SalesInvoiceDetails extends Component {
    constructor({ invoiceId, findProductByName, getOrderDetailsDefaults, getSalesInvoiceDetails, addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail,
        locateProduct }) {
        super();

        this.invoiceId = invoiceId;
        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getSalesInvoiceDetails = getSalesInvoiceDetails;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.locateProduct = locateProduct;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.invoiceId == null) {
            return;
        }

        this.printSalesInvoiceDetails();
    }

    printSalesInvoiceDetails() {
        this.getSalesInvoiceDetails(this.invoiceId).then((details) => {
            this.renderSalesInvoiceDetails(details);
        });
    }

    renderSalesInvoiceDetails(details) {
        this.list = details;
        this.forceUpdate();
    }

    add() {
        if (this.invoiceId == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('saleInvoiceDetailsModal'));
        ReactDOM.render(
            <SalesInvoiceDetailsModal
                invoiceId={this.invoiceId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                locateProduct={this.locateProduct}
                addSalesInvoiceDetail={(detail) => {
                    const promise = this.addSalesInvoiceDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesInvoiceDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('saleInvoiceDetailsModal'));
    }

    async edit(detail) {
        ReactDOM.unmountComponentAtNode(document.getElementById('saleInvoiceDetailsModal'));
        ReactDOM.render(
            <SalesInvoiceDetailsModal
                detail={detail}
                invoiceId={this.invoiceId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                defaultValueNameProduct={detail.productName}
                locateProduct={this.locateProduct}
                deleteSalesInvoiceDetail={(detailId) => {
                    const promise = this.deleteSalesInvoiceDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesInvoiceDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('saleInvoiceDetailsModal'));
    }

    render() {
        return <div id="salesInvoiceDetails">
            <div id="saleInvoiceDetailsModal"></div>
            <div id="saleInvoiceDetailsModal2"></div>
            <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <div className="tableOverflowContainer tableOverflowContainer2">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
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
                                { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 200 }
                            ]}
                            onRowClick={(data) => {
                                this.edit(data.row);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

class SalesInvoiceDetailsModal extends Component {
    constructor({ detail, invoiceId, findProductByName, getOrderDetailsDefaults, defaultValueNameProduct, addSalesInvoiceDetail, deleteSalesInvoiceDetail,
        locateProduct }) {
        super();

        this.detail = detail;
        this.invoiceId = invoiceId;
        this.findProductByName = findProductByName;

        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.locateProduct = locateProduct;

        this.currentSelectedProductId = detail != null ? detail.product : null;
        this.open = true;

        this.productDefaults = this.productDefaults.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
        this.add = this.add.bind(this);
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
        detail.invoice = parseInt(this.invoiceId);
        detail.product = parseInt(this.currentSelectedProductId);
        detail.price = parseFloat(this.refs.price.value);
        detail.quantity = parseInt(this.refs.quantity.value);
        detail.vatPercent = parseFloat(this.refs.vatPercent.value);
        return detail;
    }

    add() {
        const detail = this.getOrderDetailFromForm();

        this.addSalesInvoiceDetail(detail).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteSalesInvoiceDetail(this.detail.id).then((ok) => {
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
        ReactDOM.unmountComponentAtNode(document.getElementById("saleInvoiceDetailsModal2"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.refs.productName.value = product.name;
                this.productDefaults();
            }}
        />, document.getElementById("saleInvoiceDetailsModal2"));
    }

    render() {
        return (
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('sale-invoice-detail')}
                </this.DialogTitle>
                <DialogContent>
                    <label>{i18next.t('product')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                disabled={this.detail != null}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="productName" defaultValue={this.defaultValueNameProduct}
                            readOnly={true} style={{ 'width': '94%' }} />
                    </div>

                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('price')}</label>
                            <input type="number" class="form-control" ref="price" defaultValue={this.detail != null ? this.detail.price : '0'}
                                onChange={this.calcTotalAmount} readOnly={this.detail != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('quantity')}</label>
                            <input type="number" class="form-control" ref="quantity" defaultValue={this.detail != null ? this.detail.quantity : '1'}
                                onChange={this.calcTotalAmount} readOnly={this.detail != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('vat-percent')}</label>
                            <input type="number" class="form-control" ref="vatPercent" defaultValue={this.detail != null ? this.detail.vatPercent : '21'}
                                onChange={this.calcTotalAmount} readOnly={this.detail != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-amount')}</label>
                            <input type="number" class="form-control" ref="totalAmount" defaultValue={this.detail != null ? this.detail.totalAmount : '0'}
                                readOnly={true} />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                </DialogActions>
            </Dialog>
        );
    }
}

export default SalesInvoiceDetails;
