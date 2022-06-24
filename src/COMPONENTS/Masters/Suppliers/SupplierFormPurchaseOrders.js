/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

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

import PurchaseOrderForm from "../../Purchases/Orders/PurchaseOrderForm";



class SupplierFormPurchaseOrders extends Component {
    constructor({ supplierId, getSupplierPurchaseOrders, getPurchaseOrdersFunctions }) {
        super();

        this.list = [];

        this.supplierId = supplierId;
        this.getSupplierPurchaseOrders = getSupplierPurchaseOrders;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;

        this.editOrder = this.editOrder.bind(this);
    }

    componentDidMount() {
        if (this.supplierId == null) {
            return;
        }

        this.getSupplierPurchaseOrders(this.supplierId).then((orders) => {
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
                    { field: 'supplierReference', headerName: i18next.t('supplier-reference'), width: 240 },
                    {
                        field: 'supplierName', headerName: i18next.t('supplier'), flex: 1, valueGetter: (params) => {
                            return params.row.supplier.name;
                        }
                    },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'totalProducts', headerName: i18next.t('total-products'), width: 180 },
                    { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
                ]}
                onRowClick={(data) => {
                    this.editOrder(data.row);
                }}
            />
        </div>
    }

}

export default SupplierFormPurchaseOrders;
