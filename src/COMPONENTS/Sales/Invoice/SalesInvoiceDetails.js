import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import AutocompleteField from "../../AutocompleteField";

class SalesInvoiceDetails extends Component {
    constructor({ invoiceId, findProductByName, getOrderDetailsDefaults, getSalesInvoiceDetails, addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail }) {
        super();

        this.invoiceId = invoiceId;
        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getSalesInvoiceDetails = getSalesInvoiceDetails;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;

        this.list = null;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.invoiceId == null) {
            return;
        }

        this.printSalesInvoiceDetails();
    }

    printSalesInvoiceDetails() {
        this.getSalesInvoiceDetails(this.invoiceId).then((details) => {
            this.renderSalesInvoiceDetails(details);
        });
    }

    async renderSalesInvoiceDetails(details) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(details.map((element, i) => {
            return <SalesInvoiceDetail key={i}
                detail={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);

        this.list = details;
    }

    add() {
        if (this.invoiceId == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('saleInvoiceDetailsModal'));
        ReactDOM.render(
            <SalesInvoiceDetailsModal
                invoiceId={this.invoiceId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                addSalesInvoiceDetail={(detail) => {
                    const promise = this.addSalesInvoiceDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesInvoiceDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('saleInvoiceDetailsModal'));
    }

    async edit(detail) {
        ReactDOM.unmountComponentAtNode(document.getElementById('saleInvoiceDetailsModal'));
        ReactDOM.render(
            <SalesInvoiceDetailsModal
                detail={detail}
                invoiceId={this.invoiceId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                defaultValueNameProduct={detail.productName}
                deleteSalesInvoiceDetail={(detailId) => {
                    const promise = this.deleteSalesInvoiceDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesInvoiceDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('saleInvoiceDetailsModal'));
    }

    render() {
        return <div id="salesInvoiceDetails">
            <div id="saleInvoiceDetailsModal"></div>
            <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <div className="tableOverflowContainer tableOverflowContainer2">
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
                            this.renderSalesInvoiceDetails(this.list);
                        }}>
                            <th scope="col">#</th>
                            <th field="productName" scope="col">{i18next.t('product')}</th>
                            <th field="quantity" scope="col">{i18next.t('quantity')}</th>
                            <th field="price" scope="col">{i18next.t('unit-price')}</th>
                            <th field="vatPercent" scope="col">{i18next.t('%-vat')}</th>
                            <th field="totalAmount" scope="col">{i18next.t('total-amount')}</th>
                        </tr>
                    </thead>
                    <tbody ref="render"></tbody>
                </table>
            </div>
        </div>
    }
}

class SalesInvoiceDetail extends Component {
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
        </tr>
    }
}

class SalesInvoiceDetailsModal extends Component {
    constructor({ detail, invoiceId, findProductByName, getOrderDetailsDefaults, defaultValueNameProduct, addSalesInvoiceDetail, deleteSalesInvoiceDetail }) {
        super();

        this.detail = detail;
        this.invoiceId = invoiceId;
        this.findProductByName = findProductByName;

        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;

        this.currentSelectedProductId = detail != null ? detail.product : null;

        this.productDefaults = this.productDefaults.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#invoiceDetailModal').modal({ show: true });
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
        detail.invoice = parseInt(this.invoiceId);
        detail.product = parseInt(this.currentSelectedProductId);
        detail.price = parseFloat(this.refs.price.value);
        detail.quantity = parseInt(this.refs.quantity.value);
        detail.vatPercent = parseFloat(this.refs.vatPercent.value);
        return detail;
    }

    add() {
        const detail = this.getOrderDetailFromForm();

        this.addSalesInvoiceDetail(detail).then((ok) => {
            if (ok) {
                window.$('#invoiceDetailModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteSalesInvoiceDetail(this.detail.id).then((ok) => {
            if (ok) {
                window.$('#invoiceDetailModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="invoiceDetailModal" tabindex="-1" role="dialog" aria-labelledby="invoiceDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="invoiceDetailModalLabel">{i18next.t('sale-invoice-detail')}</h5>
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
                            }} disabled={this.detail != null} />
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('price')}</label>
                                <input type="number" class="form-control" ref="price" defaultValue={this.detail != null ? this.detail.price : '0'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('quantity')}</label>
                                <input type="number" class="form-control" ref="quantity" defaultValue={this.detail != null ? this.detail.quantity : '1'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('vat-percent')}</label>
                                <input type="number" class="form-control" ref="vatPercent" defaultValue={this.detail != null ? this.detail.vatPercent : '21'}
                                    onChange={this.calcTotalAmount} readOnly={this.detail != null} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('total-amount')}</label>
                                <input type="number" class="form-control" ref="totalAmount" defaultValue={this.detail != null ? this.detail.totalAmount : '0'}
                                    readOnly={true} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SalesInvoiceDetails;
