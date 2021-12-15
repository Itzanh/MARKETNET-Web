import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import HighlightIcon from '@material-ui/icons/Highlight';
import LocateCustomer from "../../Masters/Customers/LocateCustomer";
import LocateAddress from "../../Masters/Addresses/LocateAddress";



class POSTerminals extends Component {
    constructor({ getPOSTerminals, updatePOSTerminal, locateAddress, locateCustomers, locateCurrency, locatePaymentMethods, locateBillingSeries,
        getWarehouses }) {
        super();

        this.getPOSTerminals = getPOSTerminals;
        this.updatePOSTerminal = updatePOSTerminal;

        this.locateAddress = locateAddress;
        this.locateCustomers = locateCustomers;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.getWarehouses = getWarehouses;

        this.list = [];

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getPOSTerminals().then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    edit(terminal) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<POSTerminalModal
            terminal={terminal}
            updatePOSTerminal={this.updatePOSTerminal}

            locateAddress={this.locateAddress}
            locateCustomers={this.locateCustomers}
            locateCurrency={this.locateCurrency}
            locatePaymentMethods={this.locatePaymentMethods}
            locateBillingSeries={this.locateBillingSeries}
            getWarehouses={this.getWarehouses}
        />, this.refs.renderModal);
    }

    render() {
        return <div id="tabPOSTerminals" className="formRowRoot">
            <div ref="renderModal"></div>
            <h1>{i18next.t('pos-terminals')}</h1>

            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'uuid', headerName: i18next.t('uuid'), width: 350 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class POSTerminalModal extends Component {
    constructor({ terminal, updatePOSTerminal, locateAddress, locateCustomers, locateCurrency, locatePaymentMethods, locateBillingSeries,
        getWarehouses }) {
        super();

        this.terminal = terminal;
        this.updatePOSTerminal = updatePOSTerminal;

        this.locateAddress = locateAddress;
        this.locateCustomers = locateCustomers;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.getWarehouses = getWarehouses;

        this.open = true;

        this.currentSelectedCustomerId = terminal.ordersCustomer;
        this.currentSelectedBillingAddress = terminal.ordersInvoiceAddress;
        this.currentSelectedShippingAddress = terminal.ordersDeliveryAddress;
        this.currentSelectedPaymentMethodId = terminal.ordersPaymentMethod;
        this.currentSelectedCurrencyId = terminal.ordersCurrency;
        this.currentSelectedBillingSerieId = terminal.ordersBillingSeries;


        this.update = this.update.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateCustomer = this.locateCustomer.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
    }

    async componentDidMount() {
        await this.renderCurrencies();
        await this.renderPaymentMethod();
        await this.renderBilingSeries();
        await this.renderWarehouses();
    }

    renderCurrencies() {
        return new Promise((resolve) => {
            this.locateCurrency().then((currencies) => {
                resolve();
                const components = currencies.map((currency, i) => {
                    return <option key={i + 1} value={currency.id}>{currency.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, this.refs.renderCurrency);

                this.refs.renderCurrency.value = this.terminal.ordersCurrency != null ? this.terminal.ordersCurrency : "0";
            });
        });
    }

    renderPaymentMethod() {
        return new Promise((resolve) => {
            this.locatePaymentMethods().then((paymentMethods) => {
                resolve();
                const components = paymentMethods.map((paymentMethod, i) => {
                    return <option key={i + 1} value={paymentMethod.id}>{paymentMethod.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, this.refs.renderPaymentMethod);

                this.refs.renderPaymentMethod.value = this.terminal.ordersPaymentMethod != null ? this.terminal.ordersPaymentMethod : "0";
            });
        });
    }

    renderBilingSeries() {
        return new Promise((resolve) => {
            this.locateBillingSeries().then((series) => {
                resolve();
                const components = series.map((serie, i) => {
                    return <option key={i + 1} value={serie.id}>{serie.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, this.refs.renderBillingSerie);

                this.refs.renderBillingSerie.value = this.terminal.ordersBillingSeries != null ? this.terminal.ordersBillingSeries : "0";
            });
        });
    }

    renderWarehouses() {
        return new Promise((resolve) => {
            this.getWarehouses().then((warehouses) => {
                resolve();
                warehouses.unshift({ id: "", name: "." + i18next.t('none') });

                ReactDOM.render(warehouses.map((element, i) => {
                    return <option key={i} value={element.id}
                        selected={this.order == null ? element.id = this.defaultWarehouse : element.id == this.order.warehouse}>{element.name}</option>
                }), this.refs.warehouse);

                this.refs.warehouse.value = this.terminal.ordersWarehouse != null ? this.terminal.ordersWarehouse : "";
            });
        });
    }

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
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
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
        );
    });

    DialogContent = withStyles((theme) => ({
        root: {
            padding: theme.spacing(2),
        },
    }))(MuiDialogContent);

    DialogActions = withStyles((theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1),
        },
    }))(MuiDialogActions);

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    update() {
        this.updatePOSTerminal({
            id: this.terminal.id,
            name: this.refs.name.value,
            ordersCustomer: parseInt(this.currentSelectedCustomerId),
            ordersInvoiceAddress: this.currentSelectedBillingAddress,
            ordersDeliveryAddress: this.currentSelectedShippingAddress,
            ordersPaymentMethod: parseInt(this.currentSelectedPaymentMethodId),
            ordersBillingSeries: this.currentSelectedBillingSerieId,
            ordersWarehouse: this.refs.warehouse.value,
            ordersCurrency: parseInt(this.currentSelectedCurrencyId),
        }).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    locateCustomer() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LocateCustomer
            locateCustomers={this.locateCustomers}
            onSelect={(customer) => {
                this.currentSelectedCustomerId = customer.id;
                this.refs.customerName.value = customer.name;
            }}
        />, this.refs.renderModal);
    }

    locateBillingAddr() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.currentSelectedCustomerId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedBillingAddress = addressId;
                    this.refs.billingAddress.value = addressName;
                }}
            />,
            this.refs.renderModal);
    }

    locateShippingAddr() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.currentSelectedCustomerId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
                    this.refs.shippingAddres.value = addressName;
                }}
            />,
            this.refs.renderModal);
    }

    render() {
        return (
            <div>
                <div ref="renderModal"></div>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true}
                    PaperComponent={this.PaperComponent}>
                    <this.DialogTitle onClose={this.handleClose} style={{ cursor: 'move' }} id="draggable-dialog-title">
                        {i18next.t('pos-terminal')}
                    </this.DialogTitle>
                    <this.DialogContent>
                        <label>{i18next.t('name')}</label>
                        <input type="text" class="form-control" ref="name" defaultValue={this.terminal.name} />
                        <label>{i18next.t('customer')}</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.locateCustomer}><HighlightIcon /></button>
                            </div>
                            <input type="text" class="form-control" ref="customerName" defaultValue={this.terminal.ordersCustomerName} readOnly={true} />
                        </div>
                        <label>{i18next.t('billing-address')}</label>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}><HighlightIcon /></button>
                            </div>
                            <input type="text" class="form-control" ref="billingAddress" defaultValue={this.terminal.ordersInvoiceAddressName} readOnly={true} />
                        </div>
                        <label>{i18next.t('shipping-address')}</label>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}><HighlightIcon /></button>
                            </div>
                            <input type="text" class="form-control" ref="shippingAddres" defaultValue={this.terminal.ordersDeliveryAddressName}
                                readOnly={true} />
                        </div>
                        <label>{i18next.t('payment-method')}</label>
                        <div>
                            <select class="form-control" ref="renderPaymentMethod" onChange={() => {
                                this.currentSelectedPaymentMethodId = this.refs.renderPaymentMethod.value == "0" ? null : this.refs.renderPaymentMethod.value;
                            }}>

                            </select>
                        </div>
                        <label>{i18next.t('billing-serie')}</label>
                        <div>
                            <select class="form-control" ref="renderBillingSerie" onChange={() => {
                                this.currentSelectedBillingSerieId = this.refs.renderBillingSerie.value == "0" ? null : this.refs.renderBillingSerie.value;
                            }}>

                            </select>
                        </div>
                        <label>{i18next.t('warehouse')}</label>
                        <select id="warehouse" ref="warehouse" class="form-control" disabled={this.note != null}>
                        </select>
                        <label>{i18next.t('currency')}</label>
                        <div>
                            <select class="form-control" ref="renderCurrency" onChange={() => {
                                this.currentSelectedCurrencyId = this.refs.renderCurrency.value == "0" ? null : this.refs.renderCurrency.value;
                            }}>

                            </select>
                        </div>
                    </this.DialogContent>
                    <this.DialogActions>
                        <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button>
                        <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    </this.DialogActions>
                </Dialog>
            </div>
        );
    }
}



export default POSTerminals;
