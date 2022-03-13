import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';

import chartsColors from './../../ChartsColors.json';



class CountriesSaleOrdersAmount extends Component {
    constructor({ countriesSaleOrdersAmount }) {
        super();

        this.countriesSaleOrdersAmount = countriesSaleOrdersAmount;
    }

    componentDidMount() {
        this.countriesSaleOrdersAmount().then((data) => {
            this.drawPieChart(data.amount);
            this.drawTotals(data.history, data.amount);
        });
    }

    drawPieChart(rows) {
        if (this.myChart != null) {
            this.myChart.destroy();
        }

        const data = [];
        const labels = [];

        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].amount);
            labels.push(rows[i].countryName);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: i18next.t('sale-orders-by-country'),
                    data: data,
                    backgroundColor: chartsColors,
                    hoverOffset: 4
                }]
            }
        });
    }

    drawTotals(rows, rowsAmount) {
        if (this.myChart_Totals != null) {
            this.myChart_Totals.destroy();
        }

        // key: country id, value: array of float64 amount
        const data = {};
        const labels = [];

        for (let i = 0; i < rowsAmount.length; i++) {
            data[rowsAmount[i].country] = [];
        }

        for (let i = 0; i < rows.length; i++) {
            labels.push(rows[i].year + "-" + rows[i].month);
            for (let j = 0; j < rowsAmount.length; j++) {
                const amount = rows[i].amount[rowsAmount[j].country];
                data[rowsAmount[j].country].push(amount != null ? amount : 0);
            }
        }

        const datasets = rowsAmount.map((element, i) => {
            return {
                label: element.countryName,
                data: data[element.country],
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
            <h4>{i18next.t('sale-orders-by-country')}</h4>

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
                                this.countriesSaleOrdersAmount({
                                    dateStart: new Date(this.refs.start.value),
                                    dateEnd: new Date(this.refs.end.value)
                                }).then((data) => {
                                    this.drawPieChart(data.amount);
                                    this.drawTotals(data.history, data.amount);
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



export default CountriesSaleOrdersAmount;
