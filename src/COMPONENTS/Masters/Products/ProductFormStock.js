import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class ProductFormStock extends Component {
    constructor({ productId, getStock, doneLoading }) {
        super();

        this.productId = productId;
        this.getStock = getStock;
        this.doneLoading = doneLoading;
    }

    componentDidMount() {
        if (this.productId === undefined) {
            this.doneLoading();
            return;
        }

        this.getStock(this.productId).then((stocks) => {
            ReactDOM.render(stocks.map((element, i) => {
                return <ProductFormStockRow key={i}
                    stock={element}
                />
            }), this.refs.render);
            this.doneLoading();
        });
    }

    render() {
        return <table class="table table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{i18next.t('warehouse')}</th>
                    <th scope="col">{i18next.t('quantity')}</th>
                    <th scope="col">{i18next.t('qty-pnd-receiving')}</th>
                    <th scope="col">{i18next.t('qty-pnd-serving')}</th>
                    <th scope="col">{i18next.t('qty-pnd-manufacture')}</th>
                    <th scope="col">{i18next.t('qty-available')}</th>
                </tr>
            </thead>
            <tbody ref="render"></tbody>
        </table>
    }
}

class ProductFormStockRow extends Component {
    constructor({ stock }) {
        super();

        this.stock = stock;
    }

    render() {
        return <tr>
            <th scope="row">{this.stock.warehouse}</th>
            <td>{this.stock.warehouse}</td>
            <td>{this.stock.quantity}</td>
            <td>{this.stock.quantityPendingReceived}</td>
            <td>{this.stock.quantityPendingServed}</td>
            <td>{this.stock.quantityPendingManufacture}</td>
            <td>{this.stock.quantityAvaialbe}</td>
        </tr>
    }
}

export default ProductFormStock;
