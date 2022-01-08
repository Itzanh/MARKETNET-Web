import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import AlertModal from "../../AlertModal";



class SalesOrderGenerate extends Component {
    constructor({ orderId, getSalesOrderDetails, getNameProduct, invoiceAllSaleOrder, invoiceSelectionSaleOrder, manufacturingOrderAllSaleOrder,
        manufacturingOrderPartiallySaleOrder, deliveryNoteAllSaleOrder, deliveryNotePartiallySaleOrder }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.getNameProduct = getNameProduct;
        this.invoiceAllSaleOrder = invoiceAllSaleOrder;
        this.invoiceSelectionSaleOrder = invoiceSelectionSaleOrder;
        this.manufacturingOrderAllSaleOrder = manufacturingOrderAllSaleOrder;
        this.manufacturingOrderPartiallySaleOrder = manufacturingOrderPartiallySaleOrder;
        this.deliveryNoteAllSaleOrder = deliveryNoteAllSaleOrder;
        this.deliveryNotePartiallySaleOrder = deliveryNotePartiallySaleOrder;

        this.list = [];

        this.invoiceAll = this.invoiceAll.bind(this);
        this.invoiceSelected = this.invoiceSelected.bind(this);
        this.deliveryNoteAll = this.deliveryNoteAll.bind(this);
        this.deliveryNoteSelected = this.deliveryNoteSelected.bind(this);
        this.manufacturingAll = this.manufacturingAll.bind(this);
        this.manufacturingOrderSelected = this.manufacturingOrderSelected.bind(this);
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.getSalesOrderDetails(this.orderId).then(async (details) => {
            details.forEach((element) => {
                element.quantitySelected = element.quantity - Math.max(element.quantityInvoiced, element.quantityDeliveryNote)
            });
            this.list = details;
            this.forceUpdate();
        });
    }

    invoiceAll() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        this.invoiceAllSaleOrder(this.orderId).then((ok) => {
            if (ok.ok) {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('document-generated-successfully')}
                />, this.refs.renderModal);
            } else {
                switch (ok.errorCode) {
                    case 1:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-order-is-already-invoiced')}
                        />, this.refs.renderModal);
                        break;
                    case 2:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('there-are-no-details-to-invoice')}
                        />, this.refs.renderModal);
                        break;
                    default: // 0
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('error-document-not-generated')}
                        />, this.refs.renderModal);
                }
            }
        });
    }

    invoiceSelected() {
        const details = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].quantitySelected > 0) {
                details.push({
                    id: this.list[i].id,
                    quantity: this.list[i].quantitySelected
                });
            }
        }

        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        if (details.length === 0) {
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('generation-result')}
                modalText={i18next.t('error-document-not-generated')}
            />, this.refs.renderModal);
            return;
        }
        const request = {
            orderId: this.orderId,
            selection: details
        };
        this.invoiceSelectionSaleOrder(request).then((ok) => {
            if (ok.ok) {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('document-generated-successfully')}
                />, this.refs.renderModal);
            } else {
                switch (ok.errorCode) {
                    case 1:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-order-is-already-invoiced')}
                        />, this.refs.renderModal);
                        break;
                    case 2:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-selected-quantity-is-greater-than-the-quantity-in-the-detail') + ": " + ok.extraData[0]}
                        />, this.refs.renderModal);
                        break;
                    case 3:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-detail-is-already-invoiced') + ": " + ok.extraData[0]}
                        />, this.refs.renderModal);
                        break;
                    case 4:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-selected-quantity-is-greater-than-the-quantity-pending-of-invoicing-in-the-detail'
                                + ": " + ok.extraData[0])}
                        />, this.refs.renderModal);
                        break;
                    default: // 0
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('error-document-not-generated')}
                        />, this.refs.renderModal);
                }
            }
        });
    }

    deliveryNoteAll() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        this.deliveryNoteAllSaleOrder(this.orderId).then((ok) => {
            if (ok.ok) {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('document-generated-successfully')}
                />, this.refs.renderModal);
            } else {
                switch (ok.errorCode) {
                    case 1:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-order-already-has-a-delivery-note-generated')}
                        />, this.refs.renderModal);
                        break;
                    case 2:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('there-are-no-details-to-generate-the-delivery-note')}
                        />, this.refs.renderModal);
                        break;
                    default: // 0
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('error-document-not-generated')}
                        />, this.refs.renderModal);
                }
            }
        });
    }

    deliveryNoteSelected() {
        const details = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].quantitySelected > 0) {
                details.push({
                    id: this.list[i].id,
                    quantity: this.list[i].quantitySelected
                });
            }
        }

        if (details.length === 0) {
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('generation-result')}
                modalText={i18next.t('error-document-not-generated')}
            />, this.refs.renderModal);
            return;
        }
        const request = {
            orderId: this.orderId,
            selection: details
        };
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        this.deliveryNotePartiallySaleOrder(request).then((ok) => {
            if (ok.ok) {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('document-generated-successfully')}
                />, this.refs.renderModal);
            } else {
                switch (ok.errorCode) {
                    case 1:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-order-already-has-a-delivery-note-generated')}
                        />, this.refs.renderModal);
                        break;
                    case 2:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-selected-quantity-is-greater-than-the-quantity-in-the-detail') + ": " + ok.extraData[0]}
                        />, this.refs.renderModal);
                        break;
                    case 3:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-detail-has-a-delivery-note-generated') + ": " + ok.extraData[0]}
                        />, this.refs.renderModal);
                        break;
                    case 4:
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('the-selected-quantity-is-greater-than-the-quantity-pending-of-delivery-note-generation-in-the-detail'
                                + ": " + ok.extraData[0])}
                        />, this.refs.renderModal);
                        break;
                    default: // 0
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('generation-result')}
                            modalText={i18next.t('error-document-not-generated')}
                        />, this.refs.renderModal);
                }
            }
        });
    }

    manufacturingAll() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        this.manufacturingOrderAllSaleOrder(this.orderId).then((ok) => {
            if (ok) {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('document-generated-successfully')}
                />, this.refs.renderModal);
            } else {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('error-document-not-generated')}
                />, this.refs.renderModal);
            }
        });
    }

    manufacturingOrderSelected() {
        const details = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].quantitySelected > 0) {
                details.push({
                    id: this.list[i].id,
                    quantity: this.list[i].quantitySelected
                });
            }
        }

        if (details.length === 0) {
            return;
        }
        const request = {
            orderId: this.orderId,
            selection: details
        };
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        this.manufacturingOrderPartiallySaleOrder(request).then((ok) => {
            if (ok) {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('document-generated-successfully')}
                />, this.refs.renderModal);
            } else {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('error-document-not-generated')}
                />, this.refs.renderModal);
            }
        });
    }

    render() {
        return <div id="salesOrderGenerate">
            <div ref="renderModal"></div>
            <div>
                <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.invoiceAll}>{i18next.t('invoice-all')}</button>
                <button type="button" class="btn btn-success mb-1 ml-1" onClick={this.invoiceSelected}>{i18next.t('invoice-selected')}</button>

                <button type="button" class="btn btn-primary mb-1 ml-4" onClick={this.deliveryNoteAll}>{i18next.t('delivery-note-all')}</button>
                <button type="button" class="btn btn-success mb-1 ml-1" onClick={this.deliveryNoteSelected}>{i18next.t('delivery-note-selected')}</button>

                <button type="button" class="btn btn-primary mb-1 ml-4" onClick={this.manufacturingAll}>{i18next.t('manufacturing-order-all')}</button>
                <button type="button" class="btn btn-success mb-1 ml-1" onClick={this.manufacturingOrderSelected}>{i18next.t('manufacturing-order-selected')}</button>
            </div>

            <div className="tableOverflowContainer">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
                            columns={[
                                { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                                { field: 'quantity', headerName: i18next.t('quantity'), width: 200 },
                                { field: 'quantityInvoiced', headerName: i18next.t('quantity-invoiced'), width: 200 },
                                { field: 'quantityDeliveryNote', headerName: i18next.t('quantity-in-delivery-note'), width: 200 },
                                {
                                    field: 'quantitySelected', headerName: i18next.t('quantity-selected'), width: 250, type: 'number', editable: true
                                }
                            ]}
                            onCellEditCommit={(params) => {
                                for (let i = 0; i < this.list.length; i++) {
                                    if (this.list[i].id === params.row.id) {
                                        this.list[i].quantitySelected = params.value;
                                        break;
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}



export default SalesOrderGenerate;
