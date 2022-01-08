import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import ComplexManufacturingOrderModal from "../../Manufacturing/ComplexOrders/ComplexManufacturingOrderModal";



class ProductComplexManufacturingOrders extends Component {
    constructor({ productId, getProductComplexManufacturingOrders, getManufacturingOrderTypes, insertComplexManufacturingOrder, deleteComplexManufacturingOrder,
        toggleManufactuedComplexManufacturingOrder, getComplexManufacturingOrderManufacturingOrder, getRegisterTransactionalLogs }) {
        super();

        this.productId = productId;
        this.getProductComplexManufacturingOrders = getProductComplexManufacturingOrders;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.insertComplexManufacturingOrder = insertComplexManufacturingOrder;
        this.deleteComplexManufacturingOrder = deleteComplexManufacturingOrder;
        this.toggleManufactuedComplexManufacturingOrder = toggleManufactuedComplexManufacturingOrder;
        this.getComplexManufacturingOrderManufacturingOrder = getComplexManufacturingOrderManufacturingOrder;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getAndRenderComplexManufacturingOrders();
    }

    async getAndRenderComplexManufacturingOrders() {
        if (this.productId != undefined) {
            this.getProductComplexManufacturingOrders({
                productId: this.productId
            }).then((orders) => {
                this.renderComplexManufacturingOrders(orders);
            });
        }
    }

    renderComplexManufacturingOrders(orders) {
        this.list = orders;
        this.forceUpdate();
    }

    search() {
        if (this.productId == null) {
            return;
        }

        this.getProductComplexManufacturingOrders({
            productId: this.productId,
            startDate: new Date(this.refs.start.value),
            endDate: new Date(this.refs.end.value),
            manufactured: this.refs.manufactured.value
        }).then(async (details) => {
            this.list = details;
            this.forceUpdate();
        });
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
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
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
                manufacturingOrderTagPrinted={this.manufacturingOrderTagPrinted}
                getComplexManufacturingOrderManufacturingOrder={this.getComplexManufacturingOrderManufacturingOrder}
            />,
            document.getElementById('renderComplexManufacturingOrdersModal'));
    }

    render() {
        return <div id="tabComplexManufacturingOrders" className="formRowRoot">
            <div id="renderComplexManufacturingOrdersModal"></div>
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
                                { field: 'typeName', headerName: i18next.t('type'), flex: 1 },
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
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductComplexManufacturingOrders;
