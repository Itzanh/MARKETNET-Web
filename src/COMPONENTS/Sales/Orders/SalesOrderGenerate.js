import { Component } from "react";
import ReactDOM from 'react-dom';

class SalesOrderGenerate extends Component {
    constructor({ orderId, getSalesOrderDetails, getNameProduct }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.getNameProduct = getNameProduct;
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.getSalesOrderDetails(this.orderId).then(async (details) => {
            ReactDOM.render(details.map((element, i) => {
                element.productName = "...";
                return <SalesOrderGenerateDetail key={i}
                    detail={element}
                    edit={this.edit}
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
                return <SalesOrderGenerateDetail key={i}
                    detail={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    render() {
        return <div id="salesOrderGenerate">
            <div id="salesOrderDetailsModal"></div>

            <div>
                <button type="button" class="btn btn-primary">Invoice all</button>
                <button type="button" class="btn btn-success">Invoice selected</button>

                <button type="button" class="btn btn-primary">Delivery note all</button>
                <button type="button" class="btn btn-success">Delivery note selected</button>

                <button type="button" class="btn btn-primary">Manufacturing order all</button>
                <button type="button" class="btn btn-success">Manufacturing order selected</button>
            </div>

            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Quantity invoiced</th>
                        <th scope="col">Quantity in delivery note</th>
                        <th scope="col">Quantity selected</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class SalesOrderGenerateDetail extends Component {
    constructor({ detail }) {
        super();

        this.detail = detail;
    }

    render() {
        return <tr>
            <th scope="row">{this.detail.id}</th>
            <td>{this.detail.productName}</td>
            <td>{this.detail.quantity}</td>
            <td>{this.detail.quantityInvoiced}</td>
            <td>{this.detail.quantityDeliveryNote}</td>
            <td><input type="number" class="form-control"
                defaultValue={this.detail.quantity - Math.max(this.detail.quantityInvoiced, this.detail.quantityDeliveryNote)} /></td>
        </tr>
    }
}

export default SalesOrderGenerate;
