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

import SalesOrderForm from "../Orders/SalesOrderForm";



class SalesDeliveryNotesRelations extends Component {
    constructor({ noteId, getSalesDeliveryNotesRelations, getSalesOrdersFunctions }) {
        super();

        this.relations = {
            orders: [],
            shippings: []
        };

        this.noteId = noteId;
        this.getSalesDeliveryNotesRelations = getSalesDeliveryNotesRelations;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;

        this.editOrder = this.editOrder.bind(this);
    }

    componentDidMount() {
        if (this.noteId == null) {
            return;
        }

        this.getSalesDeliveryNotesRelations(this.noteId).then((relations) => {
            this.relations = relations;
            setTimeout(() => {
                this.forceUpdate();
            }, 0);
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
                            { field: 'id', headerName: '#', width: 90 },
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
                    <h4>{i18next.t('shipping')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.shippings}
                        columns={[
                            { field: 'id', headerName: '#', width: 90 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), flex: 1, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            { field: 'sent', headerName: i18next.t('sent'), width: 150, type: 'boolean' }
                        ]}
                        onRowClick={(data) => {
                            this.editNote(data.row);
                        }}
                    />
                </div>
            </div>
        </div>
    }
}

export default SalesDeliveryNotesRelations;
