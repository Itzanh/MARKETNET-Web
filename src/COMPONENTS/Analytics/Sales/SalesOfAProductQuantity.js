import { Component } from "react";
import ReactDOM from 'react-dom';
import { Chart } from "chart.js";
import i18next from 'i18next';
import LocateProduct from "../../Masters/Products/LocateProduct";
import HighlightIcon from '@material-ui/icons/Highlight';
import { DataGrid } from '@material-ui/data-grid';
import { Button } from "@material-ui/core";

import chartsColors from './../../ChartsColors.json';



class SalesOfAProductQuantity extends Component {
    constructor({ salesOfAProductQuantity, locateProduct }) {
        super();

        this.salesOfAProductQuantity = salesOfAProductQuantity;
        this.locateProduct = locateProduct;

        this.list = [];
        this.currentSelectedProductId = null;

        this.locateProducts = this.locateProducts.bind(this);
    }

    draw(rows) {
        if (this.myChart != null) {
            this.myChart.destroy();
        }

        // key: product id, value: array of int64 amount
        const data = {};
        const labels = [];

        for (let i = 0; i < this.list.length; i++) {
            data[this.list[i].id] = [];
        }

        for (let i = 0; i < rows.length; i++) {
            labels.push(rows[i].year + "-" + rows[i].month);
            for (let j = 0; j < this.list.length; j++) {
                const quantity = rows[i].quantity[this.list[j].id];
                data[this.list[j].id].push(quantity != null ? quantity : 0);
            }
        }

        const datasets = this.list.map((element, i) => {
            return {
                label: element.productName,
                data: data[element.id],
                fill: false,
                backgroundColor: chartsColors[i % chartsColors.length],
                borderColor: chartsColors[i % chartsColors.length],
                tension: 0.1
            }
        });

        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
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
        ReactDOM.unmountComponentAtNode(document.getElementById("tabSalesOfAProductQuantityModal"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.list = this.list.map((element) => { return element; });
                this.list.push({
                    id: product.id,
                    productName: product.name,
                });
                this.forceUpdate();

                const productIds = this.list.map((element) => { return element.id; });
                this.salesOfAProductQuantity(productIds).then((data) => {
                    this.draw(data);
                });
            }}
        />, document.getElementById("tabSalesOfAProductQuantityModal"));
    }

    render() {
        return <div id="tabSalesOfAProductQuantity" className="formRowRoot">
            <div id="tabSalesOfAProductQuantityModal"></div>
            <h4>{i18next.t('sales-of-a-product-quantity')}</h4>

            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('product')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="productName" defaultValue={this.defaultValueNameProduct} readOnly={true} />
                    </div>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.list}
                        columns={[
                            { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                            {
                                field: "", width: 130, renderCell: (params) => (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        style={{ marginLeft: 16 }}
                                        onClick={() => {
                                            this.list = this.list.map((element) => { return element; });
                                            this.list = this.list.filter((element) => { return element.id != params.row.id });
                                            this.forceUpdate();

                                            const productIds = this.list.map((element) => { return element.id; });
                                            this.salesOfAProductQuantity(productIds).then((data) => {
                                                this.draw(data);
                                            });
                                        }}
                                    >
                                        {i18next.t('delete')}
                                    </Button>
                                ),
                            }
                        ]}
                    />
                </div>
                <div class="col">
                    <canvas id="myChart" width="1400px" height="660px"></canvas>
                </div>
            </div>

        </div>
    }
}



export default SalesOfAProductQuantity;
