import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

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

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

import AlertModal from "../../AlertModal";
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



class TransferBetweenWarehousesRequest extends Component {
    constructor({ transferBetweenWarehousesToSentToPreparationOrders, getWarehouses }) {
        super();

        this.transferBetweenWarehousesToSentToPreparationOrders = transferBetweenWarehousesToSentToPreparationOrders;
        this.getWarehouses = getWarehouses;

        this.name = React.createRef();
        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.doTransfer = this.doTransfer.bind(this);
    }

    async componentDidMount() {
        const warehouses = await this.getWarehouses();

        // render warehouse destination
        await ReactDOM.render(warehouses.map((element, i) => {
            return <option key={i} value={element.id}>{element.name}</option>
        }), document.getElementById("warehouseDestination"));

        // render warehouse origin with an aditional option: "All other warehouses"
        const warehouseOriginComponents = warehouses.map((element, i) => {
            return <option key={i} value={element.id}>{element.name}</option>
        });

        warehouseOriginComponents.unshift(<option key="-1" value="">.{i18next.t('all-other-warehoues')}</option>)

        await ReactDOM.render(warehouseOriginComponents, document.getElementById("warehouseOrigin"));

        // set the default values: set the default destination warehouse to the enterprise's default warehouse
        document.getElementById("warehouseDestination").value = window.config.defaultWarehouse;
        // set the default values: set the default origin warehouse to "All other warehouses"
        document.getElementById("warehouseOrigin").value = "";
    }

    getTransferBetweenWarehousesFromForm() {
        const transfer = {};
        transfer.name = this.name.current.value;
        transfer.warehouseOriginId = document.getElementById("warehouseOrigin").value;
        if (transfer.warehouseOriginId == "") {
            transfer.warehouseOriginId = null;
        }
        transfer.warehouseDestinationId = document.getElementById("warehouseDestination").value;
        return transfer;
    }

    doTransfer() {
        const transfer = this.getTransferBetweenWarehousesFromForm();
        if (!this.isValid(transfer)) {
            return false;
        }

        this.transferBetweenWarehousesToSentToPreparationOrders(transfer).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    isValid(transfer) {
        if (transfer.name.length === 0) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('name-cant-be-empty')}
            />, this.refs.render);
            return false;
        }
        if (transfer.name.length > 100) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('name-cant-be-longer-than-100-characters')}
            />, this.refs.render);
            return false;
        }
        if (transfer.warehouseDestinationId.length === 0) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-must-select-a-destination-warehouse')}
            />, this.refs.render);
            return false;
        }
        if (transfer.warehouseOriginId === transfer.warehouseDestinationId) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-cant-transfer-to-the-same-warehouse')}
            />, this.refs.render);
            return false;
        }
        return true;
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
        return <div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('request-transfer-between-warehouses')}
                </this.DialogTitle>
                <DialogContent>
                    <TextField id="name" inputRef={this.name} label={i18next.t('name')} variant="outlined" fullWidth size="small"
                        inputProps={{ maxLength: 100 }} />
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('warehouse-from')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="warehouseOrigin"
                        >

                        </NativeSelect>
                    </FormControl>
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('warehouse-to')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="warehouseDestination"
                        >

                        </NativeSelect>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    <button type="button" class="btn btn-primary" onClick={this.doTransfer}>{i18next.t('add')}</button>
                </DialogActions>
            </Dialog>
        </div>
    }
};



export default TransferBetweenWarehousesRequest;
