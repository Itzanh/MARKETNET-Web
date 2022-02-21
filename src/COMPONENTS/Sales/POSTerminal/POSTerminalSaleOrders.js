import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import AlertModal from "../../AlertModal";
import ReportModal from "../../ReportModal";

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
import { Button } from "@material-ui/core";

// IMG
import quotationIco from './../../../IMG/quotation.svg';
import ticketIco from './../../../IMG/ticket.svg';
import customerIco from './../../../IMG/customer.svg';

// CONSTANTS
const POS_TERMINAL_UUID_KEY = "pos_terminal_uuid";



class POSTerminalSaleOrders extends Component {
    constructor({ getCookie, posTerminalRequest, unmountMainTab, posInsertNewSaleOrder, posServeSaleOrder, posInsertNewSaleOrderDetail, getSalesOrderDetails,
        getSalesOrderRow, documentFunctions, nextCustomer, deleteSalesOrderDetail }) {
        super();

        this.getCookie = getCookie;
        this.posTerminalRequest = posTerminalRequest;
        this.unmountMainTab = unmountMainTab;
        this.posInsertNewSaleOrder = posInsertNewSaleOrder;
        this.posServeSaleOrder = posServeSaleOrder;
        this.posInsertNewSaleOrderDetail = posInsertNewSaleOrderDetail;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.getSalesOrderRow = getSalesOrderRow;
        this.documentFunctions = documentFunctions;
        this.nextCustomer = nextCustomer;
        this.deleteSalesOrderDetail = deleteSalesOrderDetail;

        this.terminalUUID = "";
        this.order = null;
        this.invoiceId = null;
        this.state = {
            list: []
        }

        this.scanBarcode = this.scanBarcode.bind(this);
        this.finishOrder = this.finishOrder.bind(this);
        this.printInvoice = this.printInvoice.bind(this);
        this.printTicket = this.printTicket.bind(this);
    }

    async componentDidMount() {
        this.registerOrReadyPOS();
        this.refs.barcode.focus();
    }

    registerOrReadyPOS() {
        const terminalUUID = this.getCookie(POS_TERMINAL_UUID_KEY);
        this.posTerminalRequest(terminalUUID).then((result) => {
            if (result.ok) {
                if (result.uuid != terminalUUID) {
                    document.cookie = POS_TERMINAL_UUID_KEY + "=" + result.uuid;
                }
                if (!result.isReady) {
                    ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                    ReactDOM.render(
                        <AlertModal
                            modalTitle={i18next.t('PONT-OF-SALE-ERROR')}
                            modalText={i18next.t('the-point-of-sale-is-not-ready-check-point-of-sale-settings-on-the-admin-menu')}
                        />,
                        this.refs.renderModal);
                    this.unmountMainTab();
                } else {
                    this.terminalUUID = result.uuid;
                    this.posInsertNewSaleOrder(result.uuid).then((order) => {
                        if (order.id <= 0) {
                            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                            ReactDOM.render(
                                <AlertModal
                                    modalTitle={i18next.t('PONT-OF-SALE-ERROR')}
                                    modalText={i18next.t('an-error-ocurred-starting-the-point-of-sale')}
                                />,
                                this.refs.renderModal);
                            this.unmountMainTab();
                        }
                        this.order = order;
                    });
                }
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(
                    <AlertModal
                        modalTitle={i18next.t('PONT-OF-SALE-ERROR')}
                        modalText={i18next.t('an-error-ocurred-starting-the-point-of-sale')}
                    />,
                    this.refs.renderModal);
                this.unmountMainTab();
            }
        });
    }

    scanBarcode() {
        const barcode = this.refs.barcode.value.padStart(13, "0");

        const quantity = parseInt(this.refs.quantity.value);
        if (quantity <= 0) {
            return;
        }

        this.posInsertNewSaleOrderDetail({
            terminal: this.terminalUUID,
            order: this.order.id,
            barCode: barcode,
            quantity: quantity
        }).then((ok) => {
            this.refs.barcode.value = "";
            if (ok) {
                this.refs.quantity.value = "1";
                this.refreshOrder();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('barcode-error')}
                    modalText={i18next.t('the-barcode-is-not-recognized-because-the-product-is-not-registered-in-the-erp')}
                />, this.refs.renderModal);
            }
        });
    }

    printSalesOrdeDetails() {
        this.getSalesOrderDetails(this.order.id).then((details) => {
            this.renderSalesOrdeDetails(details);
        });
    }

    renderSalesOrdeDetails(details) {
        this.setState((prevState) => ({
            ...prevState,
            list: details,
        }));
        setTimeout(() => {
            this.refs.barcode.focus();
        }, 400);
    }

    async refreshOrder() {
        const order = await this.getSalesOrderRow(this.order.id);
        this.order = order;
        this.forceUpdate();
        this.printSalesOrdeDetails();
    }

    finishOrder() {
        this.posServeSaleOrder(this.order.id).then((res) => {
            if (res.ok) {
                this.invoiceId = res.invoiceId;
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<POSTerminalSaleOrdersInvoiceModal
                    printInvoice={this.printInvoice}
                    printTicket={this.printTicket}
                    nextCustomer={this.nextCustomer}
                />, this.refs.renderModal);
            }
        });
    }

    printInvoice() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal2);
        ReactDOM.render(
            <ReportModal
                resource="SALES_INVOICE"
                documentId={this.invoiceId}
                grantDocumentAccessToken={this.documentFunctions.grantDocumentAccessToken}
            />,
            this.refs.renderModal2);
    }

    printTicket() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal2);
        ReactDOM.render(
            <ReportModal
                resource="SALES_INVOICE_TICKET"
                documentId={this.invoiceId}
                grantDocumentAccessToken={this.documentFunctions.grantDocumentAccessToken}
            />,
            this.refs.renderModal2);
    }

    render() {
        return <div id="tabPointOfSale" className="formRowRoot">
            <div ref="renderModal"></div>
            <div ref="renderModal2"></div>
            <h1>{i18next.t('point-of-sale')}</h1>
            <div class="form-row ml-3">
                <div class="col">
                    <h4>{i18next.t('total-products')}</h4>
                    <h3>{this.order != null ? this.order.totalProducts : '0'}</h3>
                </div>
                <div class="col">
                    <h4>{i18next.t('vat-amount')}</h4>
                    <h3>{this.order != null ? this.order.vatAmount : '0'}</h3>
                </div>
                <div class="col">
                    <h4>{i18next.t('total-with-discount')}</h4>
                    <h3>{this.order != null ? this.order.totalWithDiscount : '0'}</h3>
                </div>
                <div class="col">
                    <h4>{i18next.t('total-amount')}</h4>
                    <h3>{this.order != null ? this.order.totalAmount : '0'}</h3>
                </div>
                <div class="col finish-order">
                    <button type="button" class="btn btn-primary" onClick={this.finishOrder}>{i18next.t('finish-order')}</button>
                </div>
            </div>

            <div class="form-row mt-2 mb-2 ml-2 mr-2">
                <div class="col">
                    <label>{i18next.t('scan-barcode-here')}</label>
                    <input type="text" class="form-control" ref="barcode" placeholder={i18next.t('scan-barcode-here')} autofocus onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            this.scanBarcode();
                        }
                    }} />
                </div>
                <div class="col">
                    <label>{i18next.t('quantity')}</label>
                    <input type="number" class="form-control" ref="quantity" placeholder={i18next.t('quantity')} defaultValue="1" min="1" />
                </div>
            </div>

            <DataGrid
                ref="table"
                autoHeight
                rows={this.state.list}
                columns={[
                    { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                    { field: 'price', headerName: i18next.t('price'), width: 250 },
                    { field: 'quantity', headerName: i18next.t('quantity'), width: 200 },
                    { field: 'vatPercent', headerName: i18next.t('%-vat'), width: 200 },
                    { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 300 },
                    {
                        field: "", width: 150, renderCell: (params) => (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 16 }}
                                onClick={() => {
                                    this.deleteSalesOrderDetail(params.row.id).then(() => {
                                        this.refreshOrder();
                                    });
                                }}
                            >
                                {i18next.t('delete')}
                            </Button>
                        ),
                    }
                ]}
            />
        </div>
    }
}

class POSTerminalSaleOrdersInvoiceModal extends Component {
    constructor({ printInvoice, printTicket, nextCustomer }) {
        super();

        this.printInvoice = printInvoice;
        this.printTicket = printTicket;
        this.nextCustomer = nextCustomer;

        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.next = this.next.bind(this);
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

    next() {
        this.handleClose();
        this.nextCustomer();
    }

    render() {
        return (
            <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                id="posTerminalSaleOrdersInvoiceModal" PaperComponent={this.PaperComponent}>
                <this.DialogTitle onClose={this.handleClose} style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('pos-terminal')}
                </this.DialogTitle>
                <this.DialogContent>
                    <div class="form-row">
                        <div class="col modalIconOption" onClick={this.printInvoice}>
                            <img src={quotationIco} />
                            <h4>{i18next.t('invoice')}</h4>
                        </div>
                        <div class="col modalIconOption" onClick={this.printTicket}>
                            <img src={ticketIco} />
                            <h4>{i18next.t('ticket')}</h4>
                        </div>
                        <div class="col modalIconOption" onClick={this.next}>
                            <img src={customerIco} />
                            <h4>{i18next.t('next-customer')}</h4>
                        </div>
                    </div>
                </this.DialogContent>
            </Dialog>)
    }
}



export default POSTerminalSaleOrders;
