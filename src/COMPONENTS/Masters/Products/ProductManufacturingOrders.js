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

import ManufacturingOrderModal from "../../Manufacturing/Orders/ManufacturingOrderModal";



class ProductManufacturingOrders extends Component {
    constructor({ getManufacturingOrderTypes, getManufacturingOrders, addManufacturingOrder, updateManufacturingOrder, deleteManufacturingOrder,
        findProductByName, getNameProduct, toggleManufactuedManufacturingOrder, getProductRow, manufacturingOrderTagPrinted, getProductManufacturingOrders,
        productId, locateProduct, productName, manufacturingOrderTypeId, getWarehouses }) {
        super();

        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.getManufacturingOrders = getManufacturingOrders;
        this.addManufacturingOrder = addManufacturingOrder;
        this.updateManufacturingOrder = updateManufacturingOrder;
        this.deleteManufacturingOrder = deleteManufacturingOrder;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.toggleManufactuedManufacturingOrder = toggleManufactuedManufacturingOrder;
        this.getProductRow = getProductRow;
        this.manufacturingOrderTagPrinted = manufacturingOrderTagPrinted;
        this.getProductManufacturingOrders = getProductManufacturingOrders;
        this.productId = productId;
        this.locateProduct = locateProduct;
        this.productName = productName;
        this.manufacturingOrderTypeId = manufacturingOrderTypeId;
        this.getWarehouses = getWarehouses;

        this.list = [];
        this.loading = true;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getAndRenderManufacturingOrders();
    }

    async getAndRenderManufacturingOrders() {
        if (this.productId != undefined) {
            this.getProductManufacturingOrders({
                productId: this.productId
            }).then((orders) => {
                this.renderManufacturingOrders(orders);
            });
        }
    }

    renderManufacturingOrders(orders) {
        this.list = orders;
        this.loading = false;
        this.forceUpdate();
    }

    search() {
        if (this.productId == null) {
            return;
        }

        this.loading = true;
        this.getProductManufacturingOrders({
            productId: this.productId,
            startDate: new Date(this.refs.start.value),
            endDate: new Date(this.refs.end.value),
            manufactured: this.refs.manufactured.value
        }).then(async (details) => {
            this.loading = false;
            this.list = details;
            this.forceUpdate();
        });
    }

    add() {
        if (this.productId == null || this.loading) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrdersModal'));
        ReactDOM.render(
            <ManufacturingOrderModal
                addManufacturingOrder={(order) => {
                    const promise = this.addManufacturingOrder(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                findProductByName={this.findProductByName}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                locateProduct={this.locateProduct}
                preSelectProductId={this.productId}
                preSelectProductName={this.productName}
                preSelectManufacturingOrdeTypeId={this.manufacturingOrderTypeId}
                getWarehouses={this.getWarehouses}
            />,
            document.getElementById('renderManufacturingOrdersModal'));
    }

    async edit(order) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrdersModal'));
        ReactDOM.render(
            <ManufacturingOrderModal
                order={order}
                defaultValueNameProduct={order.product.name}
                findProductByName={this.findProductByName}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                toggleManufactuedManufacturingOrder={(order) => {
                    const promise = this.toggleManufactuedManufacturingOrder(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                deleteManufacturingOrder={(order) => {
                    const promise = this.deleteManufacturingOrder(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                getProductRow={this.getProductRow}
                manufacturingOrderTagPrinted={this.manufacturingOrderTagPrinted}
                locateProduct={this.locateProduct}
                getWarehouses={this.getWarehouses}
            />,
            document.getElementById('renderManufacturingOrdersModal'));
    }

    render() {
        return <div id="tabManufacturingOrders" className="formRowRoot">
            <div id="renderManufacturingOrdersModal"></div>
            <div class="form-row">
                <div class="col formInputTag">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
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
                <div class="col formInputTag">
                    <label>{i18next.t('manufactured')}:</label>
                </div>
                <div class="col mw-15">
                    <select class="form-control" ref="manufactured">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="Y">{i18next.t('manufactured')}</option>
                        <option value="N">{i18next.t('not-manufactured')}</option>
                    </select>
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
                                {
                                    field: 'typeName', headerName: i18next.t('type'), width: 500, valueGetter: (params) => {
                                        return params.row.type.name;
                                    }
                                },
                                {
                                    field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                        return window.dateFormat(params.row.dateCreated)
                                    }
                                },
                                { field: 'manufactured', headerName: i18next.t('manufactured'), width: 180, type: 'boolean' },
                                { field: 'orderName', headerName: i18next.t('order-no'), width: 200 },
                            ]}
                            loading={this.loading}
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

export default ProductManufacturingOrders;
