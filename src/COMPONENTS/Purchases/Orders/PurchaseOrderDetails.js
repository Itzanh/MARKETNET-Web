import { Component } from "react";
import ReactDOM from 'react-dom';
import AutocompleteField from "../../AutocompleteField";



class PurchaseOrderDetails extends Component {
    constructor({ orderId, waiting, findProductByName, getOrderDetailsDefaults, getPurchaseOrderDetails, addPurchaseOrderDetail, updatePurchaseOrderDetail, getNameProduct,
        deletePurchaseOrderDetail }) {
        super();

        this.orderId = orderId;
        this.waiting = waiting;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseOrderDetails = getPurchaseOrderDetails;
        this.addPurchaseOrderDetail = addPurchaseOrderDetail;
        this.updatePurchaseOrderDetail = updatePurchaseOrderDetail;
        this.deletePurchaseOrderDetail = deletePurchaseOrderDetail;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.getPurchaseOrderDetails(this.orderId).then(async (details) => {
            ReactDOM.render(details.map((element, i) => {
                element.productName = "...";
                return <PurchaseOrderDetail key={i}
                    detail={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);

            for (let i = 0; i < details.length; i++) {
                if (details[i].product != null) {
                    details[i].productName = await this.getNameProduct(details[i].product);
                } else {
                    details[i].productName = "";
                }
            }

            ReactDOM.render(details.map((element, i) => {
                return <PurchaseOrderDetail key={i}
                    detail={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);
        });
    }

    add() {
        if (this.orderId == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDetailsModal'));
        ReactDOM.render(
            <PurchaseOrderDetailsModal
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                addPurchaseOrderDetail={this.addPurchaseOrderDetail}
            />,
            document.getElementById('salesOrderDetailsModal'));
    }

    async edit(detail) {
        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDetailsModal'));
        ReactDOM.render(
            <PurchaseOrderDetailsModal
                detail={detail}
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                defaultValueNameProduct={detail.productName}
                updatePurchaseOrderDetail={this.updatePurchaseOrderDetail}
                deletePurchaseOrderDetail={this.deletePurchaseOrderDetail}
                waiting={this.waiting}
            />,
            document.getElementById('salesOrderDetailsModal'));
    }

    render() {
        return <div id="salesOrderDetails">
            <div id="salesOrderDetailsModal"></div>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Unit price</th>
                        <th scope="col">% VAT</th>
                        <th scope="col">Total amount</th>
                        <th scope="col">Invoice/Delivery Note</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class PurchaseOrderDetail extends Component {
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
            <td>
                {this.detail != null ? (this.detail.quantityInvoiced == 0 ? 'Not invoiced' : (this.detail.quantityInvoiced == this.detail.quantity ? 'Invoiced' :
                    'Partially invoiced')) : ''} / {this.detail != null ? (this.detail.quantityDeliveryNote == 0 ? 'No delivery note' :
                        (this.detail.quantityDeliveryNote == this.detail.quantity ? 'Delivery note generated' : 'Partially delivered')) : ''}
            </td>
        </tr>
    }
}

class PurchaseOrderDetailsModal extends Component {
    constructor({ detail, orderId, findProductByName, getOrderDetailsDefaults, defaultValueNameProduct, addPurchaseOrderDetail, updatePurchaseOrderDetail,
        deletePurchaseOrderDetail, waiting }) {
        super();

        this.detail = detail;
        this.orderId = orderId;
        this.findProductByName = findProductByName;

        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.addPurchaseOrderDetail = addPurchaseOrderDetail;
        this.updatePurchaseOrderDetail = updatePurchaseOrderDetail;
        this.deletePurchaseOrderDetail = deletePurchaseOrderDetail;
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

        this.addPurchaseOrderDetail(detail).then((ok) => {
            if (ok) {
                window.$('#orderDetailModal').modal('hide');
            }
        });
    }

    update() {
        const detail = this.getOrderDetailFromForm();
        detail.id = this.detail.id;

        this.updatePurchaseOrderDetail(detail).then((ok) => {
            if (ok) {
                window.$('#orderDetailModal').modal('hide');
            }
        });
    }

    delete() {
        this.deletePurchaseOrderDetail(this.detail.id).then((ok) => {
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
                        <h5 class="modal-title" id="orderDetailModalLabel">Purchase order detail</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>Product</label>
                        <AutocompleteField findByName={this.findProductByName} defaultValueId={this.detail != null ? this.detail.product : null}
                            defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                                this.currentSelectedProductId = value;
                                this.productDefaults();
                            }} disabled={this.detail != null && !this.waiting} />
                        <div class="form-row">
                            <div class="col">
                                <label>Price</label>
                                <input type="number" class="form-control" ref="price" defaultValue={this.detail != null ? this.detail.price : '0'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                            </div>
                            <div class="col">
                                <label>Quantity</label>
                                <input type="number" class="form-control" ref="quantity" defaultValue={this.detail != null ? this.detail.quantity : '1'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                            </div>
                            <div class="col">
                                <label>VAT Percent</label>
                                <input type="number" class="form-control" ref="vatPercent" defaultValue={this.detail != null ? this.detail.vatPercent : '21'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null && !this.waiting} />
                            </div>
                            <div class="col">
                                <label>Total amount</label>
                                <input type="number" class="form-control" ref="totalAmount" defaultValue={this.detail != null ? this.detail.totalAmount : '0'}
                                    readOnly={true} />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <div class="form-row">
                                    <div class="col">
                                        <label>Invoice</label>
                                        <input type="text" class="form-control" readOnly={true}
                                            defaultValue={this.detail != null ? (this.detail.quantityInvoiced == 0 ? 'Not invoiced' :
                                                (this.detail.quantityInvoiced == this.detail.quantity ? 'Invoiced' : 'Partially invoiced')) : ''} />
                                    </div>
                                    <div class="col">
                                        <label>Delivery note</label>
                                        <input type="text" class="form-control" readOnly={true}
                                            defaultValue={this.detail != null ? (this.detail.quantityDeliveryNote == 0 ? 'No delivery note' :
                                                (this.detail.quantityDeliveryNote == this.detail.quantity ? 'Delivery note generated' : 'Partially delivered')) : ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.detail != null && this.waiting ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PurchaseOrderDetails;
