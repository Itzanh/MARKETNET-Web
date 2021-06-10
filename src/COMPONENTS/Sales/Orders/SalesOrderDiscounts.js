import { Component } from "react";
import ReactDOM from 'react-dom';

import trash_ico from './../../../IMG/trash.svg';

class SalesOrderDiscounts extends Component {
    constructor({ orderId, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderDiscounts = getSalesOrderDiscounts;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;
        this.deleteSalesOrderDiscounts = deleteSalesOrderDiscounts;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.renderSalesOrderDiscounts();
    }

    renderSalesOrderDiscounts() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getSalesOrderDiscounts(this.orderId).then((discounts) => {
            ReactDOM.render(discounts.map((element, i) => {
                return <SalesOrderDiscount key={i}
                    discount={element}
                    deleteSalesOrderDiscounts={(discountId) => {
                        const promise = this.deleteSalesOrderDiscounts(discountId);
                        promise.then((ok) => {
                            if (ok) {
                                this.renderSalesOrderDiscounts();
                            }
                        });
                        return promise;
                    }}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDiscountsModal'));
        ReactDOM.render(
            <SalesOrderDiscountModal
                orderId={this.orderId}
                addSalesOrderDiscounts={(discount) => {
                    const promise = this.addSalesOrderDiscounts(discount);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderSalesOrderDiscounts();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('salesOrderDiscountsModal'));
    }

    render() {
        return <div id="salesOrderDiscounts">
            <div id="salesOrderDiscountsModal"></div>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Value tax excluded</th>
                        <th scope="col">Value tax included</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class SalesOrderDiscount extends Component {
    constructor({ discount, deleteSalesOrderDiscounts }) {
        super();

        this.discount = discount;
        this.deleteSalesOrderDiscounts = deleteSalesOrderDiscounts;
    }

    render() {
        return <tr>
            <th scope="row">{this.discount.id}</th>
            <td>{this.discount.name}</td>
            <td>{this.discount.valueTaxExcluded}</td>
            <td>{this.discount.valueTaxIncluded}</td>
            <td className="icon"><img src={trash_ico} onClick={() => {
                this.deleteSalesOrderDiscounts(this.discount.id);
            }} alt="delete" /></td>
        </tr>
    }
}

class SalesOrderDiscountModal extends Component {
    constructor({ orderId, addSalesOrderDiscounts }) {
        super();

        this.orderId = orderId;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        window.$('#discountModal').modal({ show: true });
    }

    getDiscountFromForm() {
        const discount = {};
        discount.order = this.orderId;
        discount.name = this.refs.name.value;
        discount.valueTaxIncluded = parseFloat(this.refs.valueTaxIncluded.value);
        discount.valueTaxExcluded = parseFloat(this.refs.valueTaxExcluded.value);
        return discount;
    }

    add() {
        this.addSalesOrderDiscounts(this.getDiscountFromForm()).then((ok) => {
            if (ok) {
                window.$('#discountModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="discountModal" tabindex="-1" role="dialog" aria-labelledby="discountModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="discountModalLabel">Add order discount</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>Value tax excluded</label>
                                <input type="number" class="form-control" ref="valueTaxExcluded" min="0" defaultValue="0" />
                            </div>
                            <div class="col">
                                <label>Value tax included</label>
                                <input type="number" class="form-control" ref="valueTaxIncluded" min="0" defaultValue="0" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SalesOrderDiscounts;
