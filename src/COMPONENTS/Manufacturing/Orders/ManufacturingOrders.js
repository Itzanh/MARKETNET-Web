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
import AlertModal from '../../AlertModal';

import ManufacturingOrderModal from "./ManufacturingOrderModal";
import './../../../CSS/manufacturing_orders.css';



class ManufacturingOrders extends Component {
    constructor({ getManufacturingOrderTypes, getManufacturingOrders, addManufacturingOrder, addMultipleManufacturingOrder, updateManufacturingOrder,
        deleteManufacturingOrder, findProductByName, toggleManufactuedManufacturingOrder, manufacturingOrderTagPrinted,
        locateProduct, getRegisterTransactionalLogs, getWarehouses }) {
        super();

        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.getManufacturingOrders = getManufacturingOrders;
        this.addManufacturingOrder = addManufacturingOrder;
        this.addMultipleManufacturingOrder = addMultipleManufacturingOrder;
        this.updateManufacturingOrder = updateManufacturingOrder;
        this.deleteManufacturingOrder = deleteManufacturingOrder;
        this.findProductByName = findProductByName;
        this.toggleManufactuedManufacturingOrder = toggleManufactuedManufacturingOrder;
        this.manufacturingOrderTagPrinted = manufacturingOrderTagPrinted;
        this.locateProduct = locateProduct;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getWarehouses = getWarehouses;

        this.list = [];
        this.rows = 0;
        this.sortField = "";
        this.sortAscending = true;
        this.limit = 100;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.getAndRenderManufacturingOrders = this.getAndRenderManufacturingOrders.bind(this);
    }

    async componentDidMount() {
        await new Promise((resolve) => {
            this.getManufacturingOrderTypes().then((types) => {
                types = types.filter((element) => { return !element.complex });
                types.unshift({ id: 0, name: "." + i18next.t('all') });
                ReactDOM.render(types.map((element, i) => {
                    return <option key={i} value={element.id}>{element.name}</option>
                }), this.refs.renderTypes);
                resolve();
            });
        });

        this.getAndRenderManufacturingOrders();
    }

    async getAndRenderManufacturingOrders() {
        this.getManufacturingOrders({
            offset: 0,
            limit: 100,
            orderTypeId: parseInt(this.refs.renderTypes.value),
            dateStart: new Date(this.refs.start.value),
            dateEnd: new Date(this.refs.end.value),
            status: this.refs.renderStatuses.value,
            uuid: this.refs.uuid.value
        }).then(async (orders) => {
            if (this.uuidIsValid(this.refs.uuid.value) || this.checkBase64(this.refs.uuid.value)) {
                if (orders.manufacturingOrders.length == 0) {
                    ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                    ReactDOM.render(<AlertModal
                        modalTitle={i18next.t('BARCODE-ERROR')}
                        modalText={i18next.t('there-is-no-manufacturing-order-with-a-uuid-that-matches-the-scanned-barcode')}
                    />, this.refs.renderModal);
                } else {
                    this.edit(orders.manufacturingOrders[0]);
                }
            } else {
                this.renderManufacturingOrders(orders);
            }
        });
    }

    renderManufacturingOrders(orders) {
        this.list = orders.manufacturingOrders;
        this.rows = orders.rows;
        this.forceUpdate();
    }

    uuidIsValid(uuid) {
        return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uuid);
    }

    checkBase64(base64) {
        if (base64 == "") {
            return false;
        }
        try {
            atob(base64);
        } catch (_) {
            return false;
        }
        return true;
    }

    add() {
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
                addMultipleManufacturingOrder={(order) => {
                    const promise = this.addMultipleManufacturingOrder(order);
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
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
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
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
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
                manufacturingOrderTagPrinted={this.manufacturingOrderTagPrinted}
                locateProduct={this.locateProduct}
                getWarehouses={this.getWarehouses}
            />,
            document.getElementById('renderManufacturingOrdersModal'));
    }

    render() {
        return <div id="tabManufacturingOrders" className="formRowRoot">
            <div id="renderManufacturingOrdersModal"></div>
            <div ref="renderModal"></div>
            <h4 className="ml-2">{i18next.t('manufacturing-orders')}</h4>
            <div class="form-row">
                <div class="col" style={{
                    'max-width': '10%'
                }}>
                    {window.getPermission("CANT_MANUALLY_CREATE_MANUFACTURING_ORDERS") ? null :
                        <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>}
                </div>
                <div class="col" id="manufacturingOrderSearchContainer">
                    <div class="form-row" id="manufacturingOrderSearch">
                        <div class="col">
                            <label>{i18next.t('manufacturing-order-type')}</label>
                            <select class="form-control" ref="renderTypes" onChange={this.getAndRenderManufacturingOrders}>
                            </select>
                        </div>
                        <div class="col">
                            <label for="start">{i18next.t('start-date')}:</label>
                            <input type="date" class="form-control" ref="start" />
                        </div>
                        <div class="col">
                            <label for="start">{i18next.t('end-date')}:</label>
                            <input type="date" class="form-control" ref="end" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('status')}</label>
                            <select class="form-control" ref="renderStatuses">
                                <option value="">.{i18next.t('all')}</option>
                                <option value="M">{i18next.t('manufactured')}</option>
                                <option value="N">{i18next.t('not-manufactured')}</option>
                            </select>
                        </div>
                        <div class="col">
                            <label>UUID</label>
                            <input type="text" class="form-control" ref="uuid" />
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-primary" onClick={this.getAndRenderManufacturingOrders}>{i18next.t('search')}</button>
                        </div>
                    </div>
                </div>
            </div>
            <br />
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
                    {
                        field: 'orderName', headerName: i18next.t('order-no'), width: 200, valueGetter: (params) => {
                            return params.row.order != null ? params.row.order.orderName : '';
                        }
                    },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
                onPageChange={(data) => {
                    this.getManufacturingOrders({
                        offset: data * this.limit,
                        limit: this.limit,
                        orderTypeId: this.refs.renderTypes.value
                    }).then(async (orders) => {
                        orders.manufacturingOrders = this.list.concat(orders.manufacturingOrders);
                        this.renderManufacturingOrders(orders);
                    });
                }}
                rowCount={this.rows}
            />
        </div>
    }
}

export default ManufacturingOrders;
