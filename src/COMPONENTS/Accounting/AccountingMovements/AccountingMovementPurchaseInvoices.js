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

import PurchaseInvoiceForm from "../../Purchases/Invoice/PurchaseInvoiceForm";



class AccountingMovementPurchaseInvoices extends Component {
    constructor({ movementId, getAccountingMovementPurchaseInvoices, getPurcaseInvoicesFunctions }) {
        super();

        this.list = [];

        this.movementId = movementId;
        this.getAccountingMovementPurchaseInvoices = getAccountingMovementPurchaseInvoices;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;

        this.editInvoice = this.editInvoice.bind(this);
    }

    componentDidMount() {
        this.getAccountingMovementPurchaseInvoices(this.movementId).then(async (invoices) => {
            this.renderInvoices(invoices);
        });
    }

    async renderInvoices(invoices) {
        this.list = invoices;
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

    async editInvoice(invoice) {
        const commonProps = this.getPurcaseInvoicesFunctions();

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('purchase-invoice')}
            </this.DialogTitle>
            <DialogContent>
                <PurchaseInvoiceForm
                    {...commonProps}
                    invoice={invoice}
                    tabPurcaseInvoices={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
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
                    { field: 'invoiceName', headerName: i18next.t('invoice-no'), width: 175 },
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
                    this.editInvoice(data.row);
                }}
            />
        </div>
    }
}

export default AccountingMovementPurchaseInvoices;
