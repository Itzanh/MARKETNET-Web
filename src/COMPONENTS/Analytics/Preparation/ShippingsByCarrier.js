/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';

import chartsColors from './../../ChartsColors.json';



class ShippingsByCarrier extends Component {
    constructor({ shippingByCarriers }) {
        super();

        this.shippingByCarriers = shippingByCarriers;
    }

    componentDidMount() {
        this.shippingByCarriers({}).then((data) => {
            this.draw(data.quantity);
            this.drawTotals(data.history, data.quantity);
        });
    }

    draw(rows) {
        if (this.myChart != null) {
            this.myChart.destroy();
        }

        const data = [];
        const labels = [];

        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].quantity);
            labels.push(rows[i].carrierName);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: i18next.t('shippings-by-carrier'),
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

        // key: carrier id, value: array of int32 quantity
        const data = {};
        const labels = [];

        for (let i = 0; i < rowsQuantity.length; i++) {
            data[rowsQuantity[i].carrier] = [];
        }

        for (let i = 0; i < rows.length; i++) {
            const date = new Date(rows[i].date);
            labels.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
            for (let j = 0; j < rowsQuantity.length; j++) {
                const quantity = rows[i].quantity[rowsQuantity[j].carrier];
                data[rowsQuantity[j].carrier].push(quantity != null ? quantity : 0);
            }
        }

        const datasets = rowsQuantity.map((element, i) => {
            return {
                label: element.carrierName,
                data: data[element.carrier],
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
            <h4>{i18next.t('shippings-by-carrier')}</h4>

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
                                this.shippingByCarriers({
                                    dateStart: new Date(this.refs.start.value),
                                    dateEnd: new Date(this.refs.end.value)
                                }).then((data) => {
                                    this.draw(data.quantity);
                                    this.drawTotals(data.history, data.quantity);
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



export default ShippingsByCarrier;
