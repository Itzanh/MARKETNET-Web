import { Component } from "react";
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



class SalesInvoiceAmending extends Component {
    constructor({ invoiceId, makeAmendingSaleInvoice }) {
        super();

        this.invoiceId = invoiceId;
        this.makeAmendingSaleInvoice = makeAmendingSaleInvoice;

        this.open = true;

        this.add = this.add.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    add() {
        this.makeAmendingSaleInvoice({
            invoiceId: this.invoiceId,
            quantity: parseFloat(this.refs.quantity.value),
            description: this.refs.name.value
        }).then((ok) => {
            if (ok) {
                window.$('#amendingModal').modal('hide');
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'xs'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('create-an-amending-invoice')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>{i18next.t('description')}</label>
                    <input type="text" class="form-control" ref="name" />
                </div>
                <div class="form-group">
                    <label>{i18next.t('amount')}</label>
                    <input type="number" class="form-control" ref="quantity" defaultValue="0" min="0" />
                </div>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                {this.country == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default SalesInvoiceAmending;