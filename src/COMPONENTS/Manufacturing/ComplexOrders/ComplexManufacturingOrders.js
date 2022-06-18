import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import ComplexManufacturingOrderModal from "./ComplexManufacturingOrderModal";
import './../../../CSS/complex_manufacturing_orders.css';



class ComplexManufacturingOrders extends Component {
    constructor({ getManufacturingOrderTypes, getComplexManufacturingOrder, insertComplexManufacturingOrder, insertMultipleComplexManufacturingOrders,
        deleteComplexManufacturingOrder, toggleManufactuedComplexManufacturingOrder, getComplexManufacturingOrderManufacturingOrder,
        getRegisterTransactionalLogs, complexManufacturingOrderTagPrinted, getWarehouses }) {
        super();

        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.getComplexManufacturingOrder = getComplexManufacturingOrder;
        this.insertComplexManufacturingOrder = insertComplexManufacturingOrder;
        this.insertMultipleComplexManufacturingOrders = insertMultipleComplexManufacturingOrders;
        this.deleteComplexManufacturingOrder = deleteComplexManufacturingOrder;
        this.toggleManufactuedComplexManufacturingOrder = toggleManufactuedComplexManufacturingOrder;
        this.getComplexManufacturingOrderManufacturingOrder = getComplexManufacturingOrderManufacturingOrder;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.complexManufacturingOrderTagPrinted = complexManufacturingOrderTagPrinted;
        this.getWarehouses = getWarehouses;

        this.list = [];
        this.rows = 0;
        this.limit = 100;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.getAndRenderComplexManufacturingOrders = this.getAndRenderComplexManufacturingOrders.bind(this);
    }

    async componentDidMount() {
        await new Promise((resolve) => {
            this.getManufacturingOrderTypes().then((types) => {
                types = types.filter((element) => { return element.complex });
                types.unshift({ id: 0, name: "." + i18next.t('all') });
                ReactDOM.render(types.map((element, i) => {
                    return <option key={i} value={element.id}>{element.name}</option>
                }), this.refs.renderTypes);
                resolve();
            });
        });

        this.getAndRenderComplexManufacturingOrders();
    }

    async getAndRenderComplexManufacturingOrders() {
        this.getComplexManufacturingOrder({
            offset: 0,
            limit: 100,
            orderTypeId: parseInt(this.refs.renderTypes.value),
            dateStart: new Date(this.refs.start.value),
            dateEnd: new Date(this.refs.end.value),
            status: this.refs.renderStatuses.value,
            uuid: this.refs.uuid.value
        }).then(async (orders) => {
            this.renderComplexManufacturingOrders(orders);
        });
    }

    renderComplexManufacturingOrders(orders) {
        this.list = orders.complexManufacturingOrder;
        this.rows = orders.rows;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderComplexManufacturingOrdersModal'));
        ReactDOM.render(
            <ComplexManufacturingOrderModal
                insertComplexManufacturingOrder={(order) => {
                    const promise = this.insertComplexManufacturingOrder(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderComplexManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                insertMultipleComplexManufacturingOrders={(order) => {
                    const promise = this.insertMultipleComplexManufacturingOrders(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderComplexManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getWarehouses={this.getWarehouses}
            />,
            document.getElementById('renderComplexManufacturingOrdersModal'));
    }

    async edit(order) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderComplexManufacturingOrdersModal'));
        ReactDOM.render(
            <ComplexManufacturingOrderModal
                order={order}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                toggleManufactuedComplexManufacturingOrder={(order) => {
                    const promise = this.toggleManufactuedComplexManufacturingOrder(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderComplexManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                deleteComplexManufacturingOrder={(order) => {
                    const promise = this.deleteComplexManufacturingOrder(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderComplexManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                getComplexManufacturingOrderManufacturingOrder={this.getComplexManufacturingOrderManufacturingOrder}
                complexManufacturingOrderTagPrinted={this.complexManufacturingOrderTagPrinted}
                getWarehouses={this.getWarehouses}
            />,
            document.getElementById('renderComplexManufacturingOrdersModal'));
    }

    render() {
        return <div id="tabComplexManufacturingOrders" className="formRowRoot">
            <div id="renderComplexManufacturingOrdersModal"></div>
            <h4 className="ml-2">{i18next.t('complex-manufacturing-orders')}</h4>
            <div class="form-row">
                <div class="col" style={{
                    'max-width': '10%'
                }}>
                    {window.getPermission("CANT_MANUALLY_CREATE_MANUFACTURING_ORDERS") ? null :
                        <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>}
                </div>
                <div class="col" id="complexManufacturingOrderSearchContainer">
                    <div class="form-row" id="complexManufacturingOrderSearch">
                        <div class="col">
                            <label>{i18next.t('manufacturing-order-type')}</label>
                            <select class="form-control" ref="renderTypes" onChange={this.getAndRenderComplexManufacturingOrders}>
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
                            <button type="button" class="btn btn-primary" onClick={this.getAndRenderComplexManufacturingOrders}>{i18next.t('search')}</button>
                        </div>
                    </div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'typeName', headerName: i18next.t('type'), flex: 1, valueGetter: (params) => {
                            return params.row.type.name;
                        }
                    },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'manufactured', headerName: i18next.t('manufactured'), width: 180, type: 'boolean' },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
                onPageChange={(data) => {
                    this.getComplexManufacturingOrder({
                        offset: data * this.limit,
                        limit: this.limit,
                        orderTypeId: this.refs.renderTypes.value
                    }).then(async (orders) => {
                        orders.complexManufacturingOrder = this.list.concat(orders.complexManufacturingOrder);
                        this.renderManufacturingOrders(orders);
                    });
                }}
                rowCount={this.rows}
            />
        </div>
    }
}



export default ComplexManufacturingOrders;
