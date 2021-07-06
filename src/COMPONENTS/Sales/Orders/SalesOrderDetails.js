import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import AutocompleteField from "../../AutocompleteField";

const saleOrderStates = {
    '_': 'waiting-for-payment',
    'A': 'waiting-for-purchase-order',
    'B': 'purchase-order-pending',
    'C': 'waiting-for-manufacturing-orders',
    'D': 'manufacturing-orders-pending',
    'E': 'sent-to-preparation',
    'F': 'awaiting-for-shipping',
    'G': 'shipped',
    'H': 'receiced-by-the-customer'
}

class SalesOrderDetails extends Component {
    constructor({ orderId, waiting, findProductByName, getOrderDetailsDefaults, getSalesOrderDetails, addSalesOrderDetail, updateSalesOrderDetail, getNameProduct,
        deleteSalesOrderDetail }) {
        super();

        this.orderId = orderId;
        this.waiting = waiting;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.addSalesOrderDetail = addSalesOrderDetail;
        this.updateSalesOrderDetail = updateSalesOrderDetail;
        this.deleteSalesOrderDetail = deleteSalesOrderDetail;

        this.list = null;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.printSalesOrdeDetails();
    }

    printSalesOrdeDetails() {
        this.getSalesOrderDetails(this.orderId).then((details) => {
            this.renderSalesOrdeDetails(details);
        });
    }

    async renderSalesOrdeDetails(details) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(details.map((element, i) => {
            return <SalesOrderDetail key={i}
                detail={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);

        this.list = details;
    }

    add() {
        if (this.orderId == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDetailsModal'));
        ReactDOM.render(
            <SalesOrderDetailsModal
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                addSalesOrderDetail={(detail) => {
                    const promise = this.addSalesOrderDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesOrdeDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('salesOrderDetailsModal'));
    }

    async edit(detail) {
        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDetailsModal'));
        ReactDOM.render(
            <SalesOrderDetailsModal
                detail={detail}
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                defaultValueNameProduct={detail.productName}
                updateSalesOrderDetail={(detail) => {
                    const promise = this.updateSalesOrderDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesOrdeDetails();
                        }
                    });
                    return promise;
                }}
                deleteSalesOrderDetail={(detailId) => {
                    const promise = this.deleteSalesOrderDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesOrdeDetails();
                        }
                    });
                    return promise;
                }}
                waiting={detail.quantityInvoiced === 0}
            />,
            document.getElementById('salesOrderDetailsModal'));
    }

    render() {
        return <div id="salesOrderDetails">
            <div id="salesOrderDetailsModal"></div>
            <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <div className="tableOverflowContainer">
                <table class="table table-dark">
                    <thead>
                        <tr onClick={(e) => {
                            e.preventDefault();
                            const field = e.target.getAttribute("field");
                            if (field == null) {
                                return;
                            }

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
                            this.renderSalesOrdeDetails(this.list);
                        }}>
                            <th scope="col">#</th>
                            <th field="productName" scope="col">{i18next.t('product')}</th>
                            <th field="quantity" scope="col">{i18next.t('quantity')}</th>
                            <th field="price" scope="col">{i18next.t('unit-price')}</th>
                            <th field="vatPercent" scope="col">{i18next.t('%-vat')}</th>
                            <th field="totalAmount" scope="col">{i18next.t('total-amount')}</th>
                            <th field="status" scope="col">{i18next.t('status')}</th>
                            <th scope="col">{i18next.t('invoice')}/{i18next.t('delivery-note')}</th>
                        </tr>
                    </thead>
                    <tbody ref="render"></tbody>
                </table>
            </div>
        </div>
    }
}

class SalesOrderDetail extends Component {
    constructor({ detail, edit, pos }) {
        super();

        this.detail = detail;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.detail);
        }}>
            <th scope="row">{this.pos + 1}</th>
            <td>{this.detail.productName}</td>
            <td>{this.detail.quantity}</td>
            <td>{this.detail.price}</td>
            <td>{this.detail.vatPercent}</td>
            <td>{this.detail.totalAmount}</td>
            <td>{i18next.t(saleOrderStates[this.detail.status])}</td>
            <td>
                {this.detail !== undefined ? (this.detail.quantityInvoiced === 0 ? i18next.t('not-invoiced') : (this.detail.quantityInvoiced === this.detail.quantity
                    ? i18next.t('invoiced') : i18next.t('partially-invoiced'))) : ''} / {this.detail !== undefined ? (this.detail.quantityDeliveryNote === 0 ? i18next.t('no-delivery-note') :
                        (this.detail.quantityDeliveryNote === this.detail.quantity ? i18next.t('delivery-note-generated') : i18next.t('partially-delivered'))) : ''}
            </td>
        </tr>
    }
}

class SalesOrderDetailsModal extends Component {
    constructor({ detail, orderId, findProductByName, getOrderDetailsDefaults, defaultValueNameProduct, addSalesOrderDetail, updateSalesOrderDetail,
        deleteSalesOrderDetail, waiting }) {
        super();

        this.detail = detail;
        this.orderId = orderId;
        this.findProductByName = findProductByName;

        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.addSalesOrderDetail = addSalesOrderDetail;
        this.updateSalesOrderDetail = updateSalesOrderDetail;
        this.deleteSalesOrderDetail = deleteSalesOrderDetail;
        this.waiting = waiting;

        this.currentSelectedProductId = detail != null ? detail.product : null;

        this.productDefaults = this.productDefaults.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#orderDetailModal').modal({ show: true });
    }

    productDefaults() {
        if (this.currentSelectedProductId == null) {
            this.refs.price.value = "0";
            this.refs.quantity.value = "1";
            this.refs.vatPercent.value = "21";
            this.calcTotalAmount();
        } else {
            this.getOrderDetailsDefaults(this.currentSelectedProductId).then((defaults) => {
                this.refs.price.value = defaults.price;
                this.refs.vatPercent.value = defaults.vatPercent;
                this.calcTotalAmount();
            });
        }
    }

    calcTotalAmount() {
        const price = parseFloat(this.refs.price.value);
        const quantity = parseInt(this.refs.quantity.value);
        const vatPercent = parseFloat(this.refs.vatPercent.value);

        this.refs.totalAmount.value = ((price * quantity) * (1 + (vatPercent / 100))).toFixed(6);
    }

    getOrderDetailFromForm() {
        const detail = {};
        detail.order = parseInt(this.orderId);
        detail.product = parseInt(this.currentSelectedProductId);
        detail.price = parseFloat(this.refs.price.value);
        detail.quantity = parseInt(this.refs.quantity.value);
        detail.vatPercent = parseFloat(this.refs.vatPercent.value);
        return detail;
    }

    add() {
        const detail = this.getOrderDetailFromForm();

        this.addSalesOrderDetail(detail).then((ok) => {
            if (ok) {
                window.$('#orderDetailModal').modal('hide');
            }
        });
    }

    update() {
        const detail = this.getOrderDetailFromForm();
        detail.id = this.detail.id;

        this.updateSalesOrderDetail(detail).then((ok) => {
            if (ok) {
                window.$('#orderDetailModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteSalesOrderDetail(this.detail.id).then((ok) => {
            if (ok) {
                window.$('#orderDetailModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="orderDetailModal" tabindex="-1" role="dialog" aria-labelledby="orderDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="orderDetailModalLabel">{i18next.t('sale-order-detail')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>{i18next.t('product')}</label>
                        <AutocompleteField findByName={this.findProductByName} defaultValueId={this.detail != null ? this.detail.product : null}
                            defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                                this.currentSelectedProductId = value;
                                this.productDefaults();
                            }} disabled={this.detail != null && !this.waiting} />
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('price')}</label>
                                <input type="number" class="form-control" ref="price" defaultValue={this.detail != null ? this.detail.price : '0'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('quantity')}</label>
                                <input type="number" class="form-control" ref="quantity" defaultValue={this.detail != null ? this.detail.quantity : '1'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('vat-percent')}</label>
                                <input type="number" class="form-control" ref="vatPercent" defaultValue={this.detail != null ? this.detail.vatPercent : '21'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('total-amount')}</label>
                                <input type="number" class="form-control" ref="totalAmount" defaultValue={this.detail != null ? this.detail.totalAmount : '0'}
                                    readOnly={true} />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <div class="form-row">
                                    <div class="col">
                                        <label>{i18next.t('invoice')}</label>
                                        <input type="text" class="form-control" readOnly={true}
                                            defaultValue={this.detail !== undefined ? (this.detail.quantityInvoiced === 0
                                                ? i18next.t('not-invoiced') :
                                                (this.detail.quantityInvoiced === this.detail.quantity ? i18next.t('invoiced') : i18next.t('partially-invoiced'))) : ''} />
                                    </div>
                                    <div class="col">
                                        <label>{i18next.t('delivery-note')}</label>
                                        <input type="text" class="form-control" readOnly={true}
                                            defaultValue={this.detail !== undefined ? (this.detail.quantityDeliveryNote === 0 ? i18next.t('no-delivery-note') :
                                                (this.detail.quantityDeliveryNote === this.detail.quantity ? i18next.t('delivery-note-generated') : i18next.t('partially-delivered'))) : ''}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <label>{i18next.t('status')}</label>
                                <input type="text" class="form-control" defaultValue={this.detail !== undefined ? i18next.t(saleOrderStates[this.detail.status]) : ''}
                                    readOnly={true} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.detail != null && this.waiting ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SalesOrderDetails;
