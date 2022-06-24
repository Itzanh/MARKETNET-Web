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

import SalesOrderForm from "../Orders/SalesOrderForm";
import SalesDeliveryNotesForm from "../DeliveryNotes/SalesDeliveryNotesForm";
import SalesInvoiceForm from "./SalesInvoiceForm";



class SalesInvoiceRelations extends Component {
    constructor({ invoiceId, getSalesInvoiceRelations, getSalesOrdersFunctions, getSalesDeliveryNotesFunctions, getSalesInvoicesFuntions }) {
        super();

        this.relations = {
            orders: [],
            notes: [],
            invoices: []
        };

        this.invoiceId = invoiceId;
        this.getSalesInvoiceRelations = getSalesInvoiceRelations;

        this.getSalesOrdersFunctions = getSalesOrdersFunctions;
        this.getSalesDeliveryNotesFunctions = getSalesDeliveryNotesFunctions;
        this.getSalesInvoicesFuntions = getSalesInvoicesFuntions;

        this.editOrder = this.editOrder.bind(this);
        this.editNote = this.editNote.bind(this);
        this.editInvoice = this.editInvoice.bind(this);
    }

    componentDidMount() {
        if (this.invoiceId == null) {
            return;
        }

        this.getSalesInvoiceRelations(this.invoiceId).then((relations) => {
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
                />
            </DialogContent>
        </Dialog>, this.refs.render);
    }

    async editNote(note) {
        const commonProps = this.getSalesDeliveryNotesFunctions();

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('sales-delivery-note')}
            </this.DialogTitle>
            <DialogContent>
                <SalesDeliveryNotesForm
                    {...commonProps}
                    note={note}
                    tabSalesDeliveryNotes={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
                />
            </DialogContent>
        </Dialog>, this.refs.render);
    }

    async editInvoice(invoice) {
        const commonProps = this.getSalesInvoicesFuntions();

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('sale-invoice')}
            </this.DialogTitle>
            <DialogContent>
                <SalesInvoiceForm
                    {...commonProps}
                    invoice={invoice}
                    tabSalesInvoices={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
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
                            { field: 'orderName', headerName: '#', width: 140 },
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
                    <h4>{i18next.t('delivery-notes')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.notes}
                        columns={[
                            { field: 'deliveryNoteName', headerName: '#', width: 140 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), flex: 1, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
                        ]}
                        onRowClick={(data) => {
                            this.editNote(data.row);
                        }}
                    />
                </div>
                <div class="col">
                    <h4>{i18next.t('invoices')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.invoices}
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
                            this.editInvoice(data.row);
                        }}
                    />
                </div>
            </div>
        </div>
    }
}

export default SalesInvoiceRelations;
