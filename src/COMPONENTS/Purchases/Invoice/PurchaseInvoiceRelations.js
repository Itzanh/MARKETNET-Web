import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import PurchaseOrderForm from "../Orders/PurchaseOrderForm";
import PurchaseInvoiceForm from "./PurchaseInvoiceForm";



class PurchaseInvoiceRelations extends Component {
    constructor({ invoiceId, getPurchaseInvoiceRelations, getPurchaseOrdersFunctions, getPurcaseInvoicesFunctions }) {
        super();

        this.relations = {
            orders: [],
            invoices: []
        };

        this.invoiceId = invoiceId;
        this.getPurchaseInvoiceRelations = getPurchaseInvoiceRelations;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;

        this.editOrder = this.editOrder.bind(this);
        this.editInvoice = this.editInvoice.bind(this);
    }

    componentDidMount() {
        if (this.invoiceId == null) {
            return;
        }

        this.getPurchaseInvoiceRelations(this.invoiceId).then((relations) => {
            this.relations = relations;
            this.forceUpdate();
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

    async editOrder(order) {
        const commonProps = this.getPurchaseOrdersFunctions();

        var defaultValueNameSupplier;
        if (order.supplier != null)
            defaultValueNameSupplier = await commonProps.getSupplierName(order.supplier);
        var defaultValueNameBillingAddress;
        if (order.billingAddress != null)
            defaultValueNameBillingAddress = await commonProps.getNameAddress(order.billingAddress);
        var defaultValueNameShippingAddress;
        if (order.shippingAddress != null)
            defaultValueNameShippingAddress = await commonProps.getNameAddress(order.shippingAddress);
        var defaultValueNameWarehouse = await commonProps.getNameWarehouse(order.warehouse);

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('purchase-order')}
            </this.DialogTitle>
            <DialogContent>
                <PurchaseOrderForm
                    {...commonProps}
                    order={order}
                    tabPurchaseOrders={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
                    defaultValueNameSupplier={defaultValueNameSupplier}
                    defaultValueNameBillingAddress={defaultValueNameBillingAddress}
                    defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                    defaultValueNameWarehouse={defaultValueNameWarehouse}
                />
            </DialogContent>
        </Dialog>, this.refs.render);
    }

    async editInvoice(invoice) {
        const commonProps = this.getPurcaseInvoicesFunctions();

        var defaultValueNameSupplier;
        if (invoice.supplier != null)
            defaultValueNameSupplier = await commonProps.getSupplierName(invoice.supplier);
        var defaultValueNameBillingAddress;
        if (invoice.billingAddress != null)
            defaultValueNameBillingAddress = await commonProps.getNameAddress(invoice.billingAddress);

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('purchase-invoice')}
            </this.DialogTitle>
            <DialogContent>
                <PurchaseInvoiceForm
                    {...commonProps}
                    invoice={invoice}
                    tabPurcaseInvoices={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
                    defaultValueNameSupplier={defaultValueNameSupplier}
                    defaultValueNameBillingAddress={defaultValueNameBillingAddress}
                />
            </DialogContent>
        </Dialog>, this.refs.render);
    }

    render() {
        return <div className="formRowRoot">
            <div ref="render"></div>
            <div class="form-row">
                <div class="col">
                    <h4>{i18next.t('orders')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.orders}
                        columns={[
                            { field: 'orderName', headerName: '#', width: 140 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), flex: 1, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
                        ]}
                        onRowClick={(data) => {
                            this.editOrder(data.row);
                        }}
                    />
                </div>
                <div class="col">
                    <h4>{i18next.t('invoices')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.invoices}
                        columns={[
                            { field: 'invoiceName', headerName: '#', width: 140 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), flex: 1, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
                        ]}
                        onRowClick={(data) => {
                            this.editInvoice(data.row);
                        }}
                    />
                </div>
            </div>
        </div>
    }
}

export default PurchaseInvoiceRelations;
