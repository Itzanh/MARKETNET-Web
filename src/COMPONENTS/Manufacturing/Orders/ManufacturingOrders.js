import { Component } from "react";
import ReactDOM from 'react-dom';
import AutocompleteField from "../../AutocompleteField";

class ManufacturingOrders extends Component {
    constructor({ getManufacturingOrderTypes, getManufacturingOrders, addManufacturingOrder, updateManufacturingOrder, deleteManufacturingOrder,
        findProductByName, getNameProduct, toggleManufactuedManufacturingOrder, getProductRow }) {
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

        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.getAndRenderManufacturingOrders = this.getAndRenderManufacturingOrders.bind(this);
    }

    async componentDidMount() {
        await new Promise((resolve) => {
            this.getManufacturingOrderTypes().then((types) => {
                types.unshift({ id: 0, name: ".Any" });
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

    async renderManufacturingOrders(orders) {
        const savedTypes = await this.getManufacturingOrderTypes();
        ReactDOM.unmountComponentAtNode(this.refs.render);
        await ReactDOM.render(orders.map((element, i) => {
            element.typeName = "...";
            element.productName = "...";

            return <ManufacturingOrder key={i}
                order={element}
                edit={this.edit}
            />
        }), this.refs.render);

        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < savedTypes.length; j++) {
                if (savedTypes[j].id === orders[i].type) {
                    orders[i].typeName = savedTypes[j].name;
                }
            }
            orders[i].productName = await this.getNameProduct(orders[i].product);
        }

        ReactDOM.render(orders.map((element, i) => {
            return <ManufacturingOrder key={i}
                order={element}
                edit={this.edit}
            />
        }), this.refs.render);
        this.list = orders;
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
            />,
            document.getElementById('renderManufacturingOrdersModal'));
    }

    render() {
        return <div id="tabManufacturingOrders" className="formRowRoot">
            <div id="renderManufacturingOrdersModal"></div>
            <h1>Manufacturing orders</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                </div>
                <div class="col">
                    <select class="form-control" ref="renderTypes" onChange={this.getAndRenderManufacturingOrders}>
                    </select>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr onClick={(e) => {
                        e.preventDefault();
                        const field = e.target.getAttribute("field");

                        if (this.sortField == field) {
                            this.sortAscending = !this.sortAscending;
                        }
                        this.sortField = field;

                        var greaterThan = 1;
                        var lessThan = -1;
                        if (!this.sortAscending) {
                            greaterThan = -1;
                            lessThan = -1;
                        }

                        this.list.sort((a, b) => {
                            if (a[field] > b[field]) {
                                return greaterThan;
                            } else if (a[field] < b[field]) {
                                return lessThan;
                            } else {
                                return 0;
                            }
                        });
                        this.renderManufacturingOrders(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="productName" scope="col">Product</th>
                        <th field="typeName" scope="col">Type</th>
                        <th field="dateCreated" scope="col">Date created</th>
                        <th field="manufactured" scope="col">Manufactured</th>
                        <th field="order" scope="col">Order</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
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

class ManufacturingOrder extends Component {
    constructor({ order, edit }) {
        super();

        this.order = order;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.order);
        }}>
            <th scope="row">{this.order.id}</th>
            <td>{this.order.productName}</td>
            <td>{this.order.typeName}</td>
            <td>{window.dateFormat(new Date(this.order.dateCreated))}</td>
            <td>{this.order.manufactured ? 'Yes' : 'No'}</td>
            <td>{this.order.order}</td>
        </tr>
    }
}

class ManufacturingOrderModal extends Component {
    constructor({ order, addManufacturingOrder, findProductByName, defaultValueNameProduct, getManufacturingOrderTypes, toggleManufactuedManufacturingOrder,
        deleteManufacturingOrder, getProductRow }) {
        super();

        this.order = order;
        this.addManufacturingOrder = addManufacturingOrder;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.toggleManufactuedManufacturingOrder = toggleManufactuedManufacturingOrder;
        this.deleteManufacturingOrder = deleteManufacturingOrder;
        this.getProductRow = getProductRow;

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
            this.refs.errorMessage.innerText = "You must select a product.";
            return false;
        }
        if (order.type === 0) {
            this.refs.errorMessage.innerText = "You must select a order type.";
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
    }

    printTagManufacturing() {
        window.open("marketnettagprinter:\\\\copies=1&barcode=datamatrix&data=" + this.order.uuid);
    }

    render() {
        return <div class="modal fade" id="manufacturingOrderModal" tabindex="-1" role="dialog" aria-labelledby="manufacturingOrderModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="manufacturingOrderModalLabel">Manufacturing order</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Product</label>
                            <AutocompleteField findByName={this.findProductByName} defaultValueId={this.order != null ? this.order.product : null}
                                defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                                    this.currentSelectedProductId = value;
                                }} disabled={this.order != null} />
                            <label>Type</label>
                            <select class="form-control" ref="renderTypes" disabled={this.order != null}>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.order != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.order == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.order != null && !this.order.manufactured ?
                            <button type="button" class="btn btn-success" onClick={this.update}>Manufactured</button> : null}
                        {this.order != null && this.order.manufactured ?
                            <button type="button" class="btn btn-danger" onClick={this.update}>Undo Manufactured</button> : null}
                        {this.order != null && this.order.manufactured ?
                            <button type="button" class="btn btn-primary" onClick={this.printTags}>Print barcode</button> : null}
                        {this.order != null && this.order.manufactured ?
                            <button type="button" class="btn btn-primary" onClick={this.printTagManufacturing}>Print DataMatrix</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ManufacturingOrders;
