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
import PurchaseOrderDetailsModal from "../../Purchases/Orders/PurchaseOrderDetailsModal";



class ProductPurchaseDetails extends Component {
    constructor({ productId, getProductPurchaseOrder, getPurchaseOrdersFunctions }) {
        super();

        this.list = [];

        this.productId = productId;
        this.getProductPurchaseOrder = getProductPurchaseOrder;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;

        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        if (this.productId == null) {
            return;
        }

        this.getProductPurchaseOrder({
            productId: this.productId
        }).then(async (details) => {
            this.list = details;
            this.forceUpdate();
        });
    }

    search() {
        if (this.productId == null) {
            return;
        }

        this.getProductPurchaseOrder({
            productId: this.productId,
            startDate: new Date(this.refs.start.value),
            endDate: new Date(this.refs.end.value)
        }).then(async (details) => {
            this.list = details;
            this.forceUpdate();
        });
    }

    async edit(detail) {
        const commonProps = await this.getPurchaseOrdersFunctions();

        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseOrderDetailsModal'));
        ReactDOM.render(
            <PurchaseOrderDetailsModal
                {...commonProps}
                detail={detail}
                orderId={this.orderId}
                deletePurchaseOrderDetail={(detailId) => {
                    const promise = commonProps.deletePurchaseOrderDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            // refresh
                            this.getProductPurchaseOrderPending(this.productId).then(async (details) => {
                                this.list = details;
                                this.forceUpdate();
                            });
                        }
                    });
                    return promise;
                }}
                waiting={detail.quantityInvoiced === 0}
                defaultValueNameProduct={detail.product.name}
            />,
            document.getElementById('purchaseOrderDetailsModal'));
    }

    render() {
        return <div id="renderPurchaseDetailsPendingTab" className="formRowRoot">
            <div id="purchaseOrderDetailsModal"></div>
            <div class="form-row mb-2">
                <div class="col formInputTag">
                    <label for="start">{i18next.t('start-date')}:</label>
                </div>
                <div class="col mw-10">
                    <input type="date" class="form-control" ref="start" />
                </div>
                <div class="col formInputTag">
                    <label for="start">{i18next.t('end-date')}:</label>
                </div>
                <div class="col mw-10">
                    <input type="date" class="form-control" ref="end" />
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.search}>{i18next.t('search')}</button>
                </div>
            </div>
            <div className="tableOverflowContainer">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
                            columns={[
                                {
                                    field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                        return params.row.product.name;
                                    }
                                },
                                { field: 'price', headerName: i18next.t('price'), width: 150 },
                                { field: 'quantity', headerName: i18next.t('quantity'), width: 150 },
                                { field: 'vatPercent', headerName: i18next.t('%-vat'), width: 150 },
                                { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 200 },
                                {
                                    field: 'quantityInvoiced', headerName: i18next.t('invoice') + "/" + i18next.t('delivery-note'), width: 300,
                                    valueGetter: (params) => {
                                        return (params.row.quantityInvoiced === 0 ? i18next.t('not-invoiced') :
                                            (params.row.quantityInvoiced === params.row.quantity
                                                ? i18next.t('invoiced') : i18next.t('partially-invoiced')))
                                            + "/" +
                                            i18next.t(params.row.quantityDeliveryNote === 0 ? i18next.t('no-delivery-note') :
                                                (params.row.quantityDeliveryNote === params.row.quantity ?
                                                    i18next.t('delivery-note-generated') : i18next.t('partially-delivered')))
                                    }
                                }
                            ]}
                            onRowClick={(data) => {
                                this.edit(data.row);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductPurchaseDetails;
