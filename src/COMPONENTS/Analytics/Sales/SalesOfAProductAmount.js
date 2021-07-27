import { Component } from "react";
import ReactDOM from 'react-dom';
import { Chart } from "chart.js";
import i18next from 'i18next';
import LocateProduct from "../../Masters/Products/LocateProduct";
import HighlightIcon from '@material-ui/icons/Highlight';

class SalesOfAProductAmount extends Component {
    constructor({ salesOfAProductAmount, locateProduct }) {
        super();

        this.salesOfAProductAmount = salesOfAProductAmount;
        this.locateProduct = locateProduct;
        this.currentSelectedProductId = null;

        this.locateProducts = this.locateProducts.bind(this);
    }

    draw(rows) {
        if (this.myChart != null) {
            this.myChart.destroy();
        }

        const data = [];
        const labels = [];

        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].amount);
            labels.push(rows[i].year + "-" + rows[i].month);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: i18next.t('sales-of-a-product-amount'),
                    data: data,
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    locateProducts() {
        ReactDOM.unmountComponentAtNode(document.getElementById("tabSalesOfAProductAmountModal"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.refs.productName.value = product.name;
                this.salesOfAProductAmount(this.currentSelectedProductId).then((data) => {
                    this.draw(data);
                });
            }}
        />, document.getElementById("tabSalesOfAProductAmountModal"));
    }

    render() {
        return <div id="tabSalesOfAProductAmount" className="formRowRoot">
            <div id="tabSalesOfAProductAmountModal"></div>
            <h1>{i18next.t('sales-of-a-product-amount')}</h1>

            <label>{i18next.t('product')}</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}><HighlightIcon /></button>
                </div>
                <input type="text" class="form-control" ref="productName" defaultValue={this.defaultValueNameProduct} readOnly={true} />
            </div>

            <canvas id="myChart" width="1600px" height="660px"></canvas>

        </div>
    }
}

export default SalesOfAProductAmount;
