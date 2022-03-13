import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';

import chartsColors from './../../ChartsColors.json';



class PaymentMethodsSaleOrdersQuantity extends Component {
    constructor({ paymentMethodsSaleOrdersAmount }) {
        super();

        this.paymentMethodsSaleOrdersAmount = paymentMethodsSaleOrdersAmount;
    }

    componentDidMount() {
        this.paymentMethodsSaleOrdersAmount({}).then((data) => {
            this.drawPieChart(data.quantity);
            this.drawTotals(data.amount, data.quantity);
        });
    }

    drawPieChart(rows) {
        if (this.myChart != null) {
            this.myChart.destroy();
        }

        const data = [];
        const labels = [];

        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].quantity);
            labels.push(rows[i].paymentMethodName);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: i18next.t('payment-methods-of-the-sale-orders'),
                    data: data,
                    backgroundColor: chartsColors,
                    hoverOffset: 4
                }]
            }
        });
    }

    drawTotals(rows, rowsQuantity) {
        if (this.myChart_Totals != null) {
            this.myChart_Totals.destroy();
        }

        // key: payment method id, value: array of float64 amount
        const data = {};
        const labels = [];

        for (let i = 0; i < rowsQuantity.length; i++) {
            data[rowsQuantity[i].paymentMethod] = [];
        }

        for (let i = 0; i < rows.length; i++) {
            labels.push(rows[i].year + "-" + rows[i].month);
            for (let j = 0; j < rowsQuantity.length; j++) {
                const amount = rows[i].amount[rowsQuantity[j].paymentMethod];
                data[rowsQuantity[j].paymentMethod].push(amount != null ? amount : 0);
            }
        }

        const datasets = rowsQuantity.map((element, i) => {
            return {
                label: element.paymentMethodName,
                data: data[element.paymentMethod],
                fill: false,
                backgroundColor: chartsColors[i % chartsColors.length],
                borderColor: chartsColors[i % chartsColors.length],
                tension: 0.1
            }
        });

        var ctx = document.getElementById('myChart_Totals').getContext('2d');
        this.myChart_Totals = new Chart(ctx, {
            type: 'line',
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

    render() {
        return <div id="tabMonthlySalesAmount" className="formRowRoot">
            <h4>{i18next.t('payment-methods-of-the-sale-orders')}</h4>

            <div class="form-row">
                <div class="col">
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col" style={{ 'max-width': '500px' }}>
                            <div class="form-row">
                                <div class="col">
                                    <label for="start">{i18next.t('start-date')}:</label>
                                    <input type="date" class="form-control" ref="start" />
                                </div>
                                <div class="col">
                                    <label for="start">{i18next.t('end-date')}:</label>
                                    <input type="date" class="form-control" ref="end" />
                                </div>
                            </div>
                        </div>
                        <div class="col" style={{ 'max-width': '100px' }}>
                            <button class="btn btn-primary" onClick={() => {
                                this.paymentMethodsSaleOrdersAmount({
                                    dateStart: new Date(this.refs.start.value),
                                    dateEnd: new Date(this.refs.end.value)
                                }).then((data) => {
                                    this.drawPieChart(data.quantity);
                                    this.drawTotals(data.amount, data.quantity);
                                });
                            }}>{i18next.t('search')}</button>
                        </div>
                    </div>
                </div>
            </div>

            <canvas id="myChart" width="1600px" height="720px" style={{ 'maxHeight': '720px' }}></canvas>
            <br />
            <br />
            <br />
            <br />
            <canvas id="myChart_Totals" width="1600px" height="720px" style={{ 'maxHeight': '720px' }}></canvas>

        </div>
    }
}



export default PaymentMethodsSaleOrdersQuantity;
