import { Component } from "react";
import ReactDOM from 'react-dom';

class SalesOrderGenerate extends Component {
    constructor({ orderId, getSalesOrderDetails, getNameProduct, invoiceAllSaleOrder, invoiceSelectionSaleOrder, manufacturingOrderAllSaleOrder,
        manufacturingOrderPartiallySaleOrder }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.getNameProduct = getNameProduct;
        this.invoiceAllSaleOrder = invoiceAllSaleOrder;
        this.invoiceSelectionSaleOrder = invoiceSelectionSaleOrder;
        this.manufacturingOrderAllSaleOrder = manufacturingOrderAllSaleOrder;
        this.manufacturingOrderPartiallySaleOrder = manufacturingOrderPartiallySaleOrder;

        this.getSelected = [];

        this.invoiceAll = this.invoiceAll.bind(this);
        this.invoiceSelected = this.invoiceSelected.bind(this);
        this.manufacturingAll = this.manufacturingAll.bind(this);
        this.manufacturingOrderSelected = this.manufacturingOrderSelected.bind(this);
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

            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(details.map((element, i) => {
                return <SalesOrderGenerateDetail key={i}
                    detail={element}
                    edit={this.edit}
                    selected={(getSelected) => {
                        this.getSelected[i] = getSelected;
                    }}
                />
            }), this.refs.render);
        });
    }

    invoiceAll() {
        this.invoiceAllSaleOrder(this.orderId);
    }

    invoiceSelected() {
        const details = [];

        for (let i = 0; i < this.getSelected.length; i++) {
            const selection = this.getSelected[i]();
            if (selection.quantity > 0) {
                details.push(selection);
            }
        }

        if (details.length === 0) {
            return;
        }
        const request = {
            saleOrderId: this.orderId,
            selection: details
        };
        this.invoiceSelectionSaleOrder(request);
    }

    manufacturingAll() {
        this.manufacturingOrderAllSaleOrder(this.orderId);
    }

    manufacturingOrderSelected() {
        const details = [];

        for (let i = 0; i < this.getSelected.length; i++) {
            const selection = this.getSelected[i]();
            if (selection.quantity > 0) {
                details.push(selection);
            }
        }

        if (details.length === 0) {
            return;
        }
        const request = {
            saleOrderId: this.orderId,
            selection: details
        };
        console.log(request)
        this.manufacturingOrderPartiallySaleOrder(request);
    }

    render() {
        return <div id="salesOrderGenerate">
            <div>
                <button type="button" class="btn btn-primary" onClick={this.invoiceAll}>Invoice all</button>
                <button type="button" class="btn btn-success" onClick={this.invoiceSelected}>Invoice selected</button>

                <button type="button" class="btn btn-primary">Delivery note all</button>
                <button type="button" class="btn btn-success">Delivery note selected</button>

                <button type="button" class="btn btn-primary" onClick={this.manufacturingAll}>Manufacturing order all</button>
                <button type="button" class="btn btn-success" onClick={this.manufacturingOrderSelected}>Manufacturing order selected</button>
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
    constructor({ detail, selected }) {
        super();

        this.detail = detail;
        this.selected = selected;

        this.getSelected = this.getSelected.bind(this);
    }

    componentDidMount() {
        if (this.selected != null) {
            this.selected(this.getSelected);
        }
    }

    getSelected() {
        return {
            "id": this.detail.id,
            "quantity": parseInt(this.refs.quantity.value)
        };
    }

    render() {
        return <tr>
            <th scope="row">{this.detail.id}</th>
            <td>{this.detail.productName}</td>
            <td>{this.detail.quantity}</td>
            <td>{this.detail.quantityInvoiced}</td>
            <td>{this.detail.quantityDeliveryNote}</td>
            <td><input type="number" class="form-control" min="0" max={this.detail.quantity} ref="quantity"
                defaultValue={this.detail.quantity - Math.max(this.detail.quantityInvoiced, this.detail.quantityDeliveryNote)} /></td>
        </tr>
    }
}

export default SalesOrderGenerate;
