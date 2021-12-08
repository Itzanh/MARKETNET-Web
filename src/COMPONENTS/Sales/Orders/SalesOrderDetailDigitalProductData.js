import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import ReactDOM from 'react-dom';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import ConfirmDelete from "../../ConfirmDelete";



class SalesOrderDetailDigitalProductData extends Component {
    constructor({ detailId, getSalesOrderDetailDigitalProductData, insertSalesOrderDetailDigitalProductData, updateSalesOrderDetailDigitalProductData,
        deleteSalesOrderDetailDigitalProductData, setDigitalSalesOrderDetailAsSent, customerId, getCustomerRow }) {
        super();

        this.detailId = detailId;
        this.getSalesOrderDetailDigitalProductData = getSalesOrderDetailDigitalProductData;
        this.insertSalesOrderDetailDigitalProductData = insertSalesOrderDetailDigitalProductData;
        this.updateSalesOrderDetailDigitalProductData = updateSalesOrderDetailDigitalProductData;
        this.deleteSalesOrderDetailDigitalProductData = deleteSalesOrderDetailDigitalProductData;
        this.setDigitalSalesOrderDetailAsSent = setDigitalSalesOrderDetailAsSent;
        this.customerId = customerId;
        this.getCustomerRow = getCustomerRow;

        this.list = [];
        this.open = true;

        this.refresh = this.refresh.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setAsSent = this.setAsSent.bind(this);
    }

    componentDidMount() {
        if (this.detailId == null) {
            return;
        }

        this.refresh();
    }

    refresh() {
        this.getSalesOrderDetailDigitalProductData(this.detailId).then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    async setAsSent() {
        const customer = await this.getCustomerRow(this.customerId);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(<SalesOrderDetailDigitalProductDataEmailModal
            destinationAddress={customer.email}
            destinationAddressName={customer.fiscalName}
            subject="Sales order digital product data"
            callback={(data) => {
                data.detail = this.detailId;
                this.setDigitalSalesOrderDetailAsSent(data).then((ok) => {
                    if (ok) {
                        this.handleClose();
                    }
                });
            }}
        />,
            document.getElementById('renderAddressModal'));
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
                    this.handleClose();
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lg'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('digital-product-data')}
            </this.DialogTitle>
            <DialogContent>
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'key', headerName: i18next.t('key'), width: 250 },
                        { field: 'value', headerName: i18next.t('value'), flex: 1 },
                    ]}
                    onRowClick={(data) => {
                        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
                        ReactDOM.render(
                            <SalesOrderDetailDigitalProductDataModal
                                detailId={this.detailId}
                                digitalData={data.row}
                                insertSalesOrderDetailDigitalProductData={this.insertSalesOrderDetailDigitalProductData}
                                updateSalesOrderDetailDigitalProductData={this.updateSalesOrderDetailDigitalProductData}
                                deleteSalesOrderDetailDigitalProductData={this.deleteSalesOrderDetailDigitalProductData}
                                callback={this.refresh}
                            />,
                            document.getElementById('renderAddressModal'));
                    }}
                />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-success" onClick={this.setAsSent}>Set as digital product sent</button>
                <button type="button" class="btn btn-primary" onClick={() => {
                    ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
                    ReactDOM.render(
                        <SalesOrderDetailDigitalProductDataModal
                            detailId={this.detailId}
                            insertSalesOrderDetailDigitalProductData={this.insertSalesOrderDetailDigitalProductData}
                            updateSalesOrderDetailDigitalProductData={this.updateSalesOrderDetailDigitalProductData}
                            deleteSalesOrderDetailDigitalProductData={this.deleteSalesOrderDetailDigitalProductData}
                            callback={this.refresh}
                        />,
                        document.getElementById('renderAddressModal'));
                }}>{i18next.t('add')}</button>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}

class SalesOrderDetailDigitalProductDataModal extends Component {
    constructor({ detailId, digitalData, insertSalesOrderDetailDigitalProductData, updateSalesOrderDetailDigitalProductData,
        deleteSalesOrderDetailDigitalProductData, callback }) {
        super();

        this.detailId = detailId;
        this.digitalData = digitalData;
        this.insertSalesOrderDetailDigitalProductData = insertSalesOrderDetailDigitalProductData;
        this.updateSalesOrderDetailDigitalProductData = updateSalesOrderDetailDigitalProductData;
        this.deleteSalesOrderDetailDigitalProductData = deleteSalesOrderDetailDigitalProductData;
        this.callback = callback;

        this.open = true;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    getDigitalProductDataFromForm() {
        return {
            detail: this.detailId,
            key: this.refs.key.value,
            value: this.refs.value.value,
        }
    }

    add() {
        const data = this.getDigitalProductDataFromForm();

        this.insertSalesOrderDetailDigitalProductData(data).then((ok) => {
            if (ok) {
                this.handleClose();
                this.callback();
            }
        })
    }

    update() {
        const data = this.getDigitalProductDataFromForm();
        data.id = this.digitalData.id;

        this.updateSalesOrderDetailDigitalProductData(data).then((ok) => {
            if (ok) {
                this.handleClose();
                this.callback();
            }
        })
    }

    delete() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderDPDdeletemodal'));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deleteSalesOrderDetailDigitalProductData(this.digitalData.id).then((ok) => {
                        if (ok) {
                            this.handleClose();
                            this.callback();
                        }
                    });
                }}
            />,
            document.getElementById('renderDPDdeletemodal'));
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
                    this.handleClose();
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
        return <div>
            <div id="renderDPDdeletemodal"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('digital-product-data')}
                </this.DialogTitle>
                <DialogContent>
                    <div class="form-group">
                        <label for="key">{i18next.t('key')}</label>
                        <input type="text" class="form-control" id="key" ref="key" defaultValue={this.digitalData != null ? this.digitalData.key : ""} />
                    </div>
                    <div class="form-group">
                        <label for="value">{i18next.t('value')}</label>
                        <input type="text" class="form-control" id="value" ref="value" defaultValue={this.digitalData != null ? this.digitalData.value : ""} />
                    </div>
                </DialogContent>
                <DialogActions>
                    {this.digitalData == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.digitalData != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    {this.digitalData != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                </DialogActions>
            </Dialog>
        </div>
    }
}

class SalesOrderDetailDigitalProductDataEmailModal extends Component {
    constructor({ destinationAddress, destinationAddressName, subject, callback }) {
        super();

        this.destinationAddress = destinationAddress;
        this.destinationAddressName = destinationAddressName;
        this.subject = subject;
        this.callback = callback;

        this.open = true;

        this.ok = this.ok.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    ok() {
        this.callback({
            sendEmail: this.refs.sendEmail.checked,
            destinationAddress: this.refs.destinationAddress.value,
            destinationAddressName: this.refs.destinationAddressName.value,
            subject: this.refs.subject.value,
        });
        this.handleClose();
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
                    this.handleClose();
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
        return <div>
            <div id="renderDPDdeletemodal"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('digital-product-data')}
                </this.DialogTitle>
                <DialogContent>
                    <div class="form-group form-check">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" id="sendEmail" ref="sendEmail" defaultChecked={true} />
                            <label class="form-check-label custom-control-label" htmlFor="sendEmail">{i18next.t('send-email')}</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="text" class="form-control" ref="destinationAddress" defaultValue={this.destinationAddress} />
                    </div>
                    <div class="form-group">
                        <label>Name to</label>
                        <input type="text" class="form-control" ref="destinationAddressName" defaultValue={this.destinationAddressName} />
                    </div>
                    <div class="form-group">
                        <label>{i18next.t('subject')}</label>
                        <input type="text" class="form-control" ref="subject" defaultValue={this.subject} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <button type="button" class="btn btn-primary" onClick={this.ok}>OK</button>
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                </DialogActions>
            </Dialog>
        </div>
    }
}



export default SalesOrderDetailDigitalProductData;
