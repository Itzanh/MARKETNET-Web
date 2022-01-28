import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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



class WebHookSettings extends Component {
    constructor({ getWebHookSettings, insertWebHookSettings, updateWebHookSettings, deleteWebHookSettings, renewAuthToken, getWebHookRequestQueue,
        getWebHookLogs, tabWebHookSettings }) {
        super();

        this.getWebHookSettings = getWebHookSettings;
        this.insertWebHookSettings = insertWebHookSettings;
        this.updateWebHookSettings = updateWebHookSettings;
        this.deleteWebHookSettings = deleteWebHookSettings;
        this.renewAuthToken = renewAuthToken;
        this.getWebHookRequestQueue = getWebHookRequestQueue;
        this.getWebHookLogs = getWebHookLogs;
        this.tabWebHookSettings = tabWebHookSettings;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getWebHookSettings().then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(<WebHookSetting
            insertWebHookSettings={this.insertWebHookSettings}
            tabWebHookSettings={this.tabWebHookSettings}
        />, document.getElementById('renderTab'));
    }

    edit(webhook) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(<WebHookSetting
            webhook={webhook}
            insertWebHookSettings={this.insertWebHookSettings}
            updateWebHookSettings={this.updateWebHookSettings}
            deleteWebHookSettings={this.deleteWebHookSettings}
            renewAuthToken={this.renewAuthToken}
            getWebHookRequestQueue={this.getWebHookRequestQueue}
            getWebHookLogs={this.getWebHookLogs}
            tabWebHookSettings={this.tabWebHookSettings}
        />, document.getElementById('renderTab'));
    }

    render() {
        return <div>
            <div ref="render"></div>
            <h4 className="ml-2">{i18next.t('webhook-settings')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'url', headerName: 'URL', flex: 1 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}



class WebHookSetting extends Component {
    constructor({ webhook, insertWebHookSettings, updateWebHookSettings, deleteWebHookSettings, renewAuthToken, getWebHookRequestQueue,
        getWebHookLogs, tabWebHookSettings }) {
        super();

        this.webhook = webhook;
        this.insertWebHookSettings = insertWebHookSettings;
        this.updateWebHookSettings = updateWebHookSettings;
        this.deleteWebHookSettings = deleteWebHookSettings;
        this.renewAuthToken = renewAuthToken;
        this.getWebHookRequestQueue = getWebHookRequestQueue;
        this.getWebHookLogs = getWebHookLogs;
        this.tabWebHookSettings = tabWebHookSettings;

        this.tab = 0;
        this.listLogs = [];
        this.listQueue = [];

        this.handleTabChange = this.handleTabChange.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.editLog = this.editLog.bind(this);
        this.editQueue = this.editQueue.bind(this);
        this.renew = this.renew.bind(this);
    }

    async componentDidMount() {
        if (this.webhook == null) {
            return;
        }

        await new Promise((resolve) => {
            this.getWebHookRequestQueue(this.webhook.id).then((list) => {
                this.listQueue = list;
                this.forceUpdate();
                resolve();
            });
        });
        this.getWebHookLogs(this.webhook.id).then((list) => {
            this.listLogs = list;
            this.forceUpdate();
        });
    }

    handleTabChange(_, tab) {
        this.tab = tab;
        this.forceUpdate();
    }

    getWebHookFromForm() {
        const webhook = {};
        webhook.url = this.refs.url.value;
        webhook.authMethod = this.refs.authMethod.value;
        webhook.saleOrders = this.refs.saleOrders.checked;
        webhook.saleOrderDetails = this.refs.saleOrderDetails.checked;
        webhook.saleOrderDetailsDigitalProductData = this.refs.saleOrderDetailsDigitalProductData.checked;
        webhook.saleInvoices = this.refs.saleInvoices.checked;
        webhook.saleInvoiceDetails = this.refs.saleInvoiceDetails.checked;
        webhook.saleDeliveryNotes = this.refs.saleDeliveryNotes.checked;
        webhook.purchaseOrders = this.refs.purchaseOrders.checked;
        webhook.purchaseOrderDetails = this.refs.purchaseOrderDetails.checked;
        webhook.purchaseInvoices = this.refs.purchaseInvoices.checked;
        webhook.purchaseInvoiceDetails = this.refs.purchaseInvoiceDetails.checked;
        webhook.purchaseDeliveryNotes = this.refs.purchaseDeliveryNotes.checked;
        webhook.customers = this.refs.customers.checked;
        webhook.suppliers = this.refs.suppliers.checked;
        webhook.products = this.refs.products.checked;
        return webhook;
    }

    add() {
        const webhook = this.getWebHookFromForm();

        this.insertWebHookSettings(webhook).then((ok) => {
            if (ok) {
                this.tabWebHookSettings();
            }
        });
    }

    update() {
        const webhook = this.getWebHookFromForm();
        webhook.id = this.webhook.id;

        this.updateWebHookSettings(webhook).then((ok) => {
            if (ok) {
                this.tabWebHookSettings();
            }
        });
    }

    delete() {
        const webhook = { id: this.webhook.id };

        this.deleteWebHookSettings(webhook).then((ok) => {
            if (ok) {
                this.tabWebHookSettings();
            }
        });
    }

    renew() {
        this.renewAuthToken({ id: this.webhook.id }).then((authCode) => {
            this.webhook.authCode = authCode;
            this.refs.authCode.value = authCode;
        });
    }

    editLog(log) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<WebHookLogModal
            log={log}
        />, this.refs.render);
    }

    editQueue(queueElement) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<WebHookQueueModal
            queueElement={queueElement}
        />, this.refs.render);
    }

    render() {
        return <div className="formRowRoot">
            <div ref="render"></div>
            <h4 className="ml-2">{i18next.t('webhook-settings')}</h4>
            <div class="form-row mb-2">
                <div class="col">
                    <label>URL</label>
                    <input type="text" class="form-control" placeholder="URL" ref="url"
                        defaultValue={this.webhook == null ? "" : this.webhook.url} />
                </div>
                <div class="col">
                    <label>{i18next.t('access-code')}</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.renew}>{i18next.t('generate')}</button>
                        </div>
                        <input type="text" class="form-control" ref="authCode" readOnly={true}
                            defaultValue={this.webhook == null ? "" : this.webhook.authCode} />
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('authentication-method')}</label>
                    <select class="form-control" ref="authMethod" defaultValue={this.webhook == null ? "H" : this.webhook.authMethod}>
                        <option value="H">Header</option>
                        <option value="P">Parameter</option>
                    </select>
                </div>
            </div>
            <AppBar position="static" style={{
                'backgroundColor': '#343a40'
            }}>
                <Tabs value={this.tab} onChange={this.handleTabChange}>
                    <Tab label={i18next.t('settings')} />
                    <Tab label={i18next.t('logs')} disabled={this.webhook == null} />
                    <Tab label={i18next.t('queue')} disabled={this.webhook == null} />
                </Tabs>
            </AppBar>

            {this.tab != 0 ? null : <div>
                <div class="col">
                    <br />
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="saleOrders" id="saleOrders"
                            defaultChecked={this.webhook !== undefined ? this.webhook.saleOrders : true} />
                        <label class="custom-control-label" htmlFor="saleOrders">{i18next.t('sales-orders')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="saleOrderDetails" id="saleOrderDetails"
                            defaultChecked={this.webhook !== undefined ? this.webhook.saleOrderDetails : true} />
                        <label class="custom-control-label" htmlFor="saleOrderDetails">{i18next.t('sale-order-details')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="saleOrderDetailsDigitalProductData" id="saleOrderDetailsDigitalProductData"
                            defaultChecked={this.webhook !== undefined ? this.webhook.saleOrderDetailsDigitalProductData : true} />
                        <label class="custom-control-label"
                            htmlFor="saleOrderDetailsDigitalProductData">{i18next.t('sale-order-details-digital-product-data')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="saleInvoices" id="saleInvoices"
                            defaultChecked={this.webhook !== undefined ? this.webhook.saleInvoices : true} />
                        <label class="custom-control-label" htmlFor="saleInvoices">{i18next.t('sale-invoices')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="saleInvoiceDetails" id="saleInvoiceDetails"
                            defaultChecked={this.webhook !== undefined ? this.webhook.saleInvoiceDetails : true} />
                        <label class="custom-control-label" htmlFor="saleInvoiceDetails">{i18next.t('sale-invoice-details')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="saleDeliveryNotes" id="saleDeliveryNotes"
                            defaultChecked={this.webhook !== undefined ? this.webhook.saleDeliveryNotes : true} />
                        <label class="custom-control-label" htmlFor="saleDeliveryNotes">{i18next.t('sales-delivery-notes')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="purchaseOrders" id="purchaseOrders"
                            defaultChecked={this.webhook !== undefined ? this.webhook.purchaseOrders : true} />
                        <label class="custom-control-label" htmlFor="purchaseOrders">{i18next.t('purchase-orders')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="purchaseOrderDetails" id="purchaseOrderDetails"
                            defaultChecked={this.webhook !== undefined ? this.webhook.purchaseOrderDetails : true} />
                        <label class="custom-control-label" htmlFor="purchaseOrderDetails">{i18next.t('purchase-order-details')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="purchaseInvoices" id="purchaseInvoices"
                            defaultChecked={this.webhook !== undefined ? this.webhook.purchaseInvoices : true} />
                        <label class="custom-control-label" htmlFor="purchaseInvoices">{i18next.t('purchase-invoices')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="purchaseInvoiceDetails" id="purchaseInvoiceDetails"
                            defaultChecked={this.webhook !== undefined ? this.webhook.purchaseInvoiceDetails : true} />
                        <label class="custom-control-label" htmlFor="purchaseInvoiceDetails">{i18next.t('purchase-invoice-details')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="purchaseDeliveryNotes" id="purchaseDeliveryNotes"
                            defaultChecked={this.webhook !== undefined ? this.webhook.purchaseDeliveryNotes : true} />
                        <label class="custom-control-label" htmlFor="purchaseDeliveryNotes">{i18next.t('purchase-delivery-notes')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="customers" id="customers"
                            defaultChecked={this.webhook !== undefined ? this.webhook.customers : true} />
                        <label class="custom-control-label" htmlFor="customers">{i18next.t('customers')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="suppliers" id="suppliers"
                            defaultChecked={this.webhook !== undefined ? this.webhook.suppliers : true} />
                        <label class="custom-control-label" htmlFor="suppliers">{i18next.t('suppliers')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="products" id="products"
                            defaultChecked={this.webhook !== undefined ? this.webhook.products : true} />
                        <label class="custom-control-label" htmlFor="products">{i18next.t('products')}</label>
                    </div>
                </div>
            </div>}

            {this.tab != 1 ? null : <div>
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.listLogs}
                    columns={[
                        { field: 'url', headerName: i18next.t('url'), flex: 1 },
                        {
                            field: 'authMethod', headerName: i18next.t('authentication-method'), width: 250, valueGetter: (params) => {
                                return params.row.authMethod == "H" ? "Header" : (params.row.authMethod == "P" ? "Parameter" : "");
                            }
                        },
                        {
                            field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                return window.dateFormat(params.row.dateCreated)
                            }
                        },
                        { field: 'receivedHttpCode', headerName: i18next.t('received-http-code'), width: 250 },
                        { field: 'method', headerName: i18next.t('method'), width: 250 },
                    ]}
                    onRowClick={(data) => {
                        this.editLog(data.row);
                    }}
                />
            </div>}

            {this.tab != 2 ? null : <div>
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.listQueue}
                    columns={[
                        { field: 'url', headerName: i18next.t('url'), flex: 1 },
                        {
                            field: 'authMethod', headerName: i18next.t('authentication-method'), width: 250, valueGetter: (params) => {
                                return params.row.authMethod == "H" ? "Header" : (params.row.authMethod == "P" ? "Parameter" : "");
                            }
                        },
                        {
                            field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                return window.dateFormat(params.row.dateCreated)
                            }
                        },
                        { field: 'method', headerName: i18next.t('method'), width: 250 },
                    ]}
                    onRowClick={(data) => {
                        this.editQueue(data.row);
                    }}
                />
            </div>}

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm" className="pt-1">
                    {this.webhook != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    {this.webhook != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    {this.webhook == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.tabWebHookSettings}>{i18next.t('cancel')}</button>
                </div>
            </div>
        </div>
    }
}


class WebHookLogModal extends Component {
    constructor({ log }) {
        super();

        this.log = log;
        this.open = true;

        this.handleClose = this.handleClose.bind(this);
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

    render() {
        return (<div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'xl'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('webhook-log')}
                </this.DialogTitle>
                <DialogContent>
                    <div class="form-row mb-2">
                        <div class="col">
                            <label>URL</label>
                            <input type="text" class="form-control" readOnly={true} defaultValue={this.log.url} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('access-code')}</label>
                            <input type="text" class="form-control" readOnly={true} defaultValue={this.log.authCode} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('authentication-method')}</label>
                            <select class="form-control" disabled={true} defaultValue={this.log.authMethod}>
                                <option value="H">Header</option>
                                <option value="P">Parameter</option>
                            </select>
                        </div>
                        <div class="col">
                            <label>{i18next.t('date')}</label>
                            <input type="text" class="form-control" readOnly={true} defaultValue={window.dateFormat(this.log.dateCreated)} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('received-http-code')}</label>
                            <input type="number" class="form-control" readOnly={true} defaultValue={this.log.receivedHttpCode} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('method')}</label>
                            <input type="text" class="form-control" readOnly={true} defaultValue={this.log.method} />
                        </div>
                    </div>
                    <label>{i18next.t('sent')}</label>
                    <textarea class="form-control" rows="15" defaultValue={this.log.sent}></textarea>
                    <label>{i18next.t('received')}</label>
                    <textarea class="form-control" rows="15" defaultValue={this.log.received}></textarea>
                </DialogContent>
                <DialogActions>
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                </DialogActions>
            </Dialog>
        </div>);
    }
}



class WebHookQueueModal extends Component {
    constructor({ queueElement }) {
        super();

        this.queueElement = queueElement;
        this.open = true;

        this.handleClose = this.handleClose.bind(this);
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

    render() {
        return (<div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'xl'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('webhook-queue')}
                </this.DialogTitle>
                <DialogContent>
                    <div class="form-row mb-2">
                        <div class="col">
                            <label>URL</label>
                            <input type="text" class="form-control" readOnly={true} defaultValue={this.queueElement.url} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('access-code')}</label>
                            <input type="text" class="form-control" readOnly={true} defaultValue={this.queueElement.authCode} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('authentication-method')}</label>
                            <select class="form-control" disabled={true} defaultValue={this.queueElement.authMethod}>
                                <option value="H">Header</option>
                                <option value="P">Parameter</option>
                            </select>
                        </div>
                        <div class="col">
                            <label>{i18next.t('date')}</label>
                            <input type="text" class="form-control" readOnly={true} defaultValue={window.dateFormat(this.queueElement.dateCreated)} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('method')}</label>
                            <input type="text" class="form-control" readOnly={true} defaultValue={this.queueElement.method} />
                        </div>
                    </div>
                    <label>{i18next.t('send')}</label>
                    <textarea class="form-control" rows="15" defaultValue={this.queueElement.send}></textarea>
                </DialogContent>
                <DialogActions>
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                </DialogActions>
            </Dialog>
        </div>);
    }
}



export default WebHookSettings;
