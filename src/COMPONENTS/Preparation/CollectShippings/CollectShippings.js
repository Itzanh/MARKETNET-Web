import { Component } from "react";
import ReactDOM from 'react-dom';

class CollectShippings extends Component {
    constructor({ getShippings, setShippingCollected }) {
        super();

        this.getShippings = getShippings;
        this.setShippingCollected = setShippingCollected;
        this.shippings = [];

        this.edit = this.edit.bind(this);
        this.all = this.all.bind(this);
        this.none = this.none.bind(this);
        this.collected = this.collected.bind(this);
    }

    componentDidMount() {
        this.getShippings().then((shippings) => {
            this.shippings = shippings;
            this.renderShipping(shippings);
        });
    }

    renderShipping(shippings) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(shippings.map((element, i) => {
            return <Shipping key={i}
                shipping={element}
                edit={this.edit}
            />
        }), this.refs.render);
    }

    edit(shipping) {
        shipping.selected = !shipping.selected;
        this.renderShipping(this.shippings);
    }

    all() {
        for (let i = 0; i < this.shippings.length; i++) {
            this.shippings[i].selected = true;
        }
        this.renderShipping(this.shippings);
    }

    none() {
        for (let i = 0; i < this.shippings.length; i++) {
            this.shippings[i].selected = false;
        }
        this.renderShipping(this.shippings);
    }

    async collected() {
        const shippings = [];
        for (let i = 0; i < this.shippings.length; i++) {
            if (this.shippings[i].selected) {
                shippings.push(this.shippings[i].id);
            }
        }
        console.log(shippings);
        await this.setShippingCollected(shippings);
        this.getShippings().then((shippings) => {
            this.shippings = shippings;
            this.renderShipping(shippings);
        });
    }

    render() {
        return <div id="tabShippings" className="formRowRoot">
            <div className="menu">
                <h1>Collect shippings</h1>
                <button type="button" class="btn btn-primary" onClick={this.all}>Select all</button>
                <button type="button" class="btn btn-primary" onClick={this.none}>Select none</button>
                <button type="button" class="btn btn-danger" onClick={this.collected}>Set selected as collected</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Sale order</th>
                        <th scope="col">Carrier</th>
                        <th scope="col">Weight</th>
                        <th scope="col">N. packages</th>
                        <th scope="col">Tracking</th>
                        <th scope="col">Sent</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Shipping extends Component {
    constructor({ shipping, edit }) {
        super();

        this.shipping = shipping;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.shipping);
        }} className={this.shipping.selected ? 'bg-primary' : ''}>
            <th scope="row">{this.shipping.id}</th>
            <td>{this.shipping.customerName}</td>
            <td>{this.shipping.saleOrderName}</td>
            <td>{this.shipping.carrierName}</td>
            <td>{this.shipping.weight}</td>
            <td>{this.shipping.packagesNumber}</td>
            <td>{this.shipping.trackingNumber}</td>
            <td>{this.shipping.sent ? 'Yes' : 'No'}</td>
        </tr>
    }
}

export default CollectShippings;
