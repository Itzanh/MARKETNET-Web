import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import { TextField } from "@material-ui/core";

import { Button } from "@material-ui/core";
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



class SalesOrderDiscounts extends Component {
    constructor({ orderId, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderDiscounts = getSalesOrderDiscounts;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;
        this.deleteSalesOrderDiscounts = deleteSalesOrderDiscounts;

        this.list = [];

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.renderSalesOrderDiscounts();
    }

    renderSalesOrderDiscounts() {
        this.getSalesOrderDiscounts(this.orderId).then((discounts) => {
            this.list = discounts;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDiscountsModal'));
        ReactDOM.render(
            <SalesOrderDiscountModal
                orderId={this.orderId}
                addSalesOrderDiscounts={(discount) => {
                    const promise = this.addSalesOrderDiscounts(discount);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderSalesOrderDiscounts();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('salesOrderDiscountsModal'));
    }

    render() {
        return <div id="salesOrderDiscounts">
            <div id="salesOrderDiscountsModal"></div>
            <button type="button" class="btn btn-primary mb-2 ml-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'valueTaxExcluded', headerName: i18next.t('value-tax-excluded'), width: 300 },
                    { field: 'valueTaxIncluded', headerName: i18next.t('value-tax-included'), width: 300 },
                    {
                        field: "", width: 130, renderCell: (params) => (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 16 }}
                                onClick={() => {
                                    this.deleteSalesOrderDiscounts(params.row.id).then(() => {
                                        this.renderSalesOrderDiscounts();
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

class SalesOrderDiscountModal extends Component {
    constructor({ orderId, addSalesOrderDiscounts }) {
        super();

        this.orderId = orderId;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;

        this.open = true;

        this.name = React.createRef();
        this.valueTaxExcluded = React.createRef();
        this.valueTaxIncluded = React.createRef();

        this.add = this.add.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    getDiscountFromForm() {
        const discount = {};
        discount.orderId = this.orderId;
        discount.name = this.name.current.value;
        discount.valueTaxIncluded = parseFloat(this.valueTaxIncluded.current.value);
        discount.valueTaxExcluded = parseFloat(this.valueTaxExcluded.current.value);
        return discount;
    }

    add() {
        this.addSalesOrderDiscounts(this.getDiscountFromForm()).then((ok) => {
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent} >
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('add-order-discount')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name} />
                </div>
                <div class="form-row">
                    <div class="col">
                        <TextField label={i18next.t('value-tax-excluded')} variant="outlined" fullWidth size="small" inputRef={this.valueTaxExcluded}
                            type="number" InputProps={{ inputProps: { min: 0 } }} defaultValue="0" />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('value-tax-included')} variant="outlined" fullWidth size="small" inputRef={this.valueTaxIncluded}
                            type="number" InputProps={{ inputProps: { min: 0 } }} defaultValue="0" />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default SalesOrderDiscounts;
