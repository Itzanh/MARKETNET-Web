import { Component } from "react";
import ReactDOM from 'react-dom';

class Needs extends Component {
    constructor({ getNeeds, purchaseNeeds }) {
        super();

        this.getNeeds = getNeeds;
        this.purchaseNeeds = purchaseNeeds;

        this.needs = [];
        this.getSelected = [];

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.getNeeds().then((needs) => {
            this.needs = needs;
            this.renderNeeds();
        });
    }

    renderNeeds() {
        ReactDOM.render(this.needs.map((element, i) => {
            return <Need key={i}
                need={element}
                edit={() => {
                    element.selected = !element.selected;
                    this.renderNeeds();
                }}
                selected={(getSelected) => {
                    this.getSelected.push(getSelected);
                }}
            />
        }), this.refs.render);
    }

    add() {
        const needs = [];
        for (let i = 0; i < this.getSelected.length; i++) {
            const need = this.getSelected[i]();
            if (need != null) {
                needs.push(need);
            }
        }
        console.log(needs);
        this.purchaseNeeds(needs);
    }

    render() {
        return <div id="tabNeeds">
            <h1>Needs</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Generate sale orders (selected)</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Supplier</th>
                        <th scope="col">Quantity needed</th>
                        <th scope="col">Quantity order</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Need extends Component {
    constructor({ need, edit, selected }) {
        super();

        this.need = need;
        this.edit = edit;
        this.selected = selected;

        this.getSelected = this.getSelected.bind(this);
    }

    componentDidMount() {
        this.selected(this.getSelected);
    }

    getSelected() {
        if (!this.need.selected) {
            return null;
        }
        return {
            "product": this.need.product,
            "quantity": parseInt(this.refs.quantity.value)
        };
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.need);
        }} className={this.need.selected ? 'bg-primary' : ''}>
            <th scope="row">{this.need.productName}</th>
            <td>{this.need.supplierName}</td>
            <td>{this.need.quantity}</td>
            <td><input type="number" class="form-control" min={this.need.quantity} ref="quantity" defaultValue={this.need.quantity} /></td>
        </tr>
    }
}

export default Needs;
