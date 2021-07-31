import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import AutocompleteField from "../../AutocompleteField";

class ManufacturingOrders extends Component {
    constructor({ getManufacturingOrderTypes, getManufacturingOrders, addManufacturingOrder, updateManufacturingOrder, deleteManufacturingOrder,
        findProductByName, getNameProduct, toggleManufactuedManufacturingOrder, getProductRow, manufacturingOrderTagPrinted }) {
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

        this.list = [];
        this.sortField = "";
        this.sortAscending = true;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.getAndRenderManufacturingOrders = this.getAndRenderManufacturingOrders.bind(this);
    }

    async componentDidMount() {
        await new Promise((resolve) => {
            this.getManufacturingOrderTypes().then((types) => {
                types.unshift({ id: 0, name: "." + i18next.t('all') });
                ReactDOM.render(types.map((element, i) => {
                    return <ManufacturingOrderType key={i}
                        type={element}
                    />
                }), this.refs.renderTypes);
                resolve();
            });
        });

        this.getAndRenderManufacturingOrders();
    }

    async getAndRenderManufacturingOrders() {
        this.getManufacturingOrders(this.refs.renderTypes.value).then(async (orders) => {
            this.renderManufacturingOrders(orders);
        });
    }

    renderManufacturingOrders(orders) {
        this.list = orders;
        this.forceUpdate();
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
                findProductByName={this.findProductByName}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
            />,
            document.getElementById('renderManufacturingOrdersModal'));
    }

    async edit(order) {
        var productName = await this.getNameProduct(order.product);
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrdersModal'));
        ReactDOM.render(
            <ManufacturingOrderModal
                order={order}
                defaultValueNameProduct={productName}
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
            />,
            document.getElementById('renderManufacturingOrdersModal'));
    }

    render() {
        return <div id="tabManufacturingOrders" className="formRowRoot">
            <div id="renderManufacturingOrdersModal"></div>
            <h1>{i18next.t('manufacturing-orders')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <select class="form-control" ref="renderTypes" onChange={this.getAndRenderManufacturingOrders}>
                    </select>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                    { field: 'typeName', headerName: i18next.t('type'), width: 500 },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'manufactured', headerName: i18next.t('manufactured'), width: 180, type: 'boolean' },
                    { field: 'orderName', headerName: i18next.t('order-no'), width: 200 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ManufacturingOrderType extends Component {
    constructor({ type }) {
        super();

        this.type = type;
    }

    render() {
        return <option value={this.type.id}>{this.type.name}</option>
    }
}

class ManufacturingOrderModal extends Component {
    constructor({ order, addManufacturingOrder, findProductByName, defaultValueNameProduct, getManufacturingOrderTypes, toggleManufactuedManufacturingOrder,
        deleteManufacturingOrder, getProductRow, manufacturingOrderTagPrinted }) {
        super();

        this.order = order;
        this.addManufacturingOrder = addManufacturingOrder;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.toggleManufactuedManufacturingOrder = toggleManufactuedManufacturingOrder;
        this.deleteManufacturingOrder = deleteManufacturingOrder;
        this.getProductRow = getProductRow;
        this.manufacturingOrderTagPrinted = manufacturingOrderTagPrinted;

        this.currentSelectedProductId = this.order != null ? this.order.product : null;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.printTags = this.printTags.bind(this);
        this.printTagManufacturing = this.printTagManufacturing.bind(this);
    }

    componentDidMount() {
        window.$('#manufacturingOrderModal').modal({ show: true });

        if (this.order == null) {
            this.getManufacturingOrderTypes().then((types) => {
                types.unshift({ id: 0, name: ".Any" });
                ReactDOM.render(types.map((element, i) => {
                    return <ManufacturingOrderType key={i}
                        type={element}
                    />
                }), this.refs.renderTypes);
            });
        } else {
            ReactDOM.render(<ManufacturingOrderType
                type={{ id: this.order.type, name: this.order.typeName }}
            />, this.refs.renderTypes);
        }
    }

    getManufacturingOrderFromForm() {
        const order = {};
        order.product = parseInt(this.currentSelectedProductId);
        order.type = parseInt(this.refs.renderTypes.value);
        return order;
    }

    isValid(order) {
        this.refs.errorMessage.innerText = "";
        if (order.product === null || order.product === 0 || isNaN(order.product)) {
            this.refs.errorMessage.innerText = i18next.t('must-product');
            return false;
        }
        if (order.type === 0) {
            this.refs.errorMessage.innerText = i18next.t('must-order-type');
            return false;
        }
        return true;
    }

    add() {
        const order = this.getManufacturingOrderFromForm();
        if (!this.isValid(order)) {
            return;
        }

        this.addManufacturingOrder(order).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderModal').modal('hide');
            }
        });
    }

    update() {
        this.toggleManufactuedManufacturingOrder(this.order.id).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteManufacturingOrder(this.order.id).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderModal').modal('hide');
            }
        });
    }

    async printTags() {
        const product = await this.getProductRow(this.order.product);
        window.open("marketnettagprinter:\\\\copies=1&barcode=ean13&data=" + product.barCode.substring(0, 12));
        this.manufacturingOrderTagPrinted(this.order.id);
    }

    printTagManufacturing() {
        window.open("marketnettagprinter:\\\\copies=1&barcode=datamatrix&data=" + this.order.uuid);
        this.manufacturingOrderTagPrinted(this.order.id);
    }

    render() {
        return <div class="modal fade" id="manufacturingOrderModal" tabindex="-1" role="dialog" aria-labelledby="manufacturingOrderModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="manufacturingOrderModalLabel">{i18next.t('manufacturing-order')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('product')}</label>
                            <AutocompleteField findByName={this.findProductByName} defaultValueId={this.order != null ? this.order.product : null}
                                defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                                    this.currentSelectedProductId = value;
                                }} disabled={this.order != null} />
                            <label>{i18next.t('type')}</label>
                            <select class="form-control" ref="renderTypes" disabled={this.order != null}>
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>User created</label>
                                <input type="text" class="form-control" readOnly={true}
                                    defaultValue={this.order != null ? this.order.userCreatedName : null} />
                            </div>
                            <div class="col">
                                <label>User manufactured</label>
                                <input type="text" class="form-control" readOnly={true}
                                    defaultValue={this.order != null ? this.order.userManufacturedName : null} />
                            </div>
                            <div class="col">
                                <label>User that printed the tag</label>
                                <input type="text" class="form-control" readOnly={true}
                                    defaultValue={this.order != null ? this.order.userTagPrintedName : null} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.order != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.order == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.order != null && !this.order.manufactured ?
                            <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('manufactured')}</button> : null}
                        {this.order != null && this.order.manufactured ?
                            <button type="button" class="btn btn-danger" onClick={this.update}>{i18next.t('undo-manufactured')}</button> : null}
                        {this.order != null && this.order.manufactured ?
                            <button type="button" class="btn btn-primary" onClick={this.printTags}>{i18next.t('print-barcode')}</button> : null}
                        {this.order != null && this.order.manufactured ?
                            <button type="button" class="btn btn-primary" onClick={this.printTagManufacturing}>{i18next.t('print-datamatrix')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ManufacturingOrders;
