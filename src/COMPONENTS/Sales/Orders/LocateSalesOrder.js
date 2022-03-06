import { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';



class LocateSalesOrder extends Component {
    constructor({ locateSaleOrder, handleSelect }) {
        super();

        this.locateSaleOrder = locateSaleOrder;
        this.handleSelect = handleSelect;

        this.list = [];
        this.rows = 0;
        this.limit = 100;
        this.offset = 0;
        this.open = true;

        this.select = this.select.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.renderOrders();
    }

    renderOrders() {
        this.locateSaleOrder({
            limit: this.limit,
            offset: this.offset
        }).then((orders) => {
            this.list = orders.orders;
            this.rows = orders.rows;
            this.forceUpdate();
        });
    }

    select(order) {
        this.handleSelect(order.id, order.orderName, order.customer);
        this.handleClose();
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

    render() {
        return <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true}
            maxWidth={'md'} PaperComponent={this.PaperComponent}>
            <this.DialogTitle onClose={this.handleClose} style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('locate-sale-order')}
            </this.DialogTitle>
            <this.DialogContent>
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'orderName', headerName: i18next.t('order-no'), width: 160 },
                        { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
                        {
                            field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                return window.dateFormat(params.row.dateCreated)
                            }
                        },
                    ]}
                    onRowClick={(data) => {
                        this.select(data.row);
                    }}
                    page={this.offset / this.limit}
                    pageSize={this.limit}
                    onPageChange={(data) => {
                        this.offset = data * this.limit;
                        this.renderOrders();
                    }}
                    rowCount={this.rows}
                />
            </this.DialogContent>
            <this.DialogActions>
                <Button autoFocus onClick={this.handleClose} color="primary">
                    {i18next.t('cancel')}
                </Button>
            </this.DialogActions>
        </Dialog>
    }
}

export default LocateSalesOrder;
