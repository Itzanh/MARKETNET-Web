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

import SalesOrderForm from "../../Sales/Orders/SalesOrderForm";

const saleOrderStates = {
    '_': 'waiting-for-payment',
    'A': 'waiting-for-purchase-order',
    'B': 'purchase-order-pending',
    'C': 'waiting-for-manufacturing-orders',
    'D': 'manufacturing-orders-pending',
    'E': 'sent-to-preparation',
    'F': 'awaiting-for-shipping',
    'G': 'shipped',
    'H': 'receiced-by-the-customer'
}



class CustomerFormSaleOrders extends Component {
    constructor({ customerId, getCustomerSaleOrders, getSalesOrdersFunctions }) {
        super();

        this.list = [];

        this.customerId = customerId;
        this.getCustomerSaleOrders = getCustomerSaleOrders;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;

        this.editOrder = this.editOrder.bind(this);
    }

    componentDidMount() {
        if (this.customerId == null) {
            return;
        }

        this.getCustomerSaleOrders(this.customerId).then((orders) => {
            this.list = orders;
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
        const commonProps = this.getSalesOrdersFunctions();

        var defaultValueNameCustomer;
        if (order.customer != null)
            defaultValueNameCustomer = await commonProps.getCustomerName(order.customer);
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
                {i18next.t('sale-order')}
            </this.DialogTitle>
            <DialogContent>
                <SalesOrderForm
                    {...commonProps}
                    order={order}
                    tabSalesOrders={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
                    defaultValueNameCustomer={defaultValueNameCustomer}
                    defaultValueNameBillingAddress={defaultValueNameBillingAddress}
                    defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                    defaultValueNameWarehouse={defaultValueNameWarehouse}
                />
            </DialogContent>
        </Dialog>, this.refs.render);
    }

    render() {
        return <div>
            <div ref="render"></div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'orderName', headerName: i18next.t('order-no'), width: 160 },
                    { field: 'reference', headerName: i18next.t('reference'), width: 150 },
                    {
                        field: 'customerName', headerName: i18next.t('customer'), flex: 1, valueGetter: (params) => {
                            return params.row.customer.name;
                        }
                    },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'totalProducts', headerName: i18next.t('total-products'), width: 180 },
                    { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 },
                    {
                        field: 'status', headerName: i18next.t('status'), width: 250, valueGetter: (params) => {
                            return i18next.t(saleOrderStates[params.row.status])
                        }
                    },
                ]}
                onRowClick={(data) => {
                    this.editOrder(data.row);
                }}
            />
        </div>
    }

}

export default CustomerFormSaleOrders;
