/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';

class DaysOfServicePurchaseOrders extends Component {
    constructor({ daysOfServicePurchaseOrders }) {
        super();

        this.daysOfServicePurchaseOrders = daysOfServicePurchaseOrders;
    }

    componentDidMount() {
        this.daysOfServicePurchaseOrders("0").then((data) => {
            this.draw(data);
        });
    }

    draw(rows) {
        if (this.myChart != null) {
            this.myChart.destroy();
        }

        const data = [];
        const labels = [];

        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].daysAverage);
            labels.push(rows[i].year + "-" + rows[i].month);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: i18next.t('days-of-service-purchase-orders'),
                    data: data,
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgb(75, 192, 192)',
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

    render() {
        return <div id="tabMonthlySalesQuantity" className="formRowRoot">
            <h4>{i18next.t('days-of-service-purchase-orders')}</h4>

            <div class="form-row">
                <div class="col">
                </div>
                <div class="col" style={{ 'padding-left': '50%' }}>
                    <div class="form-row">
                        <div class="col" style={{ 'max-width': '250px' }}>
                            <label>Year</label>
                            <input type="number" class="form-control" defaultValue="0" ref="year" />
                        </div>
                        <div class="col" style={{ 'max-width': '100px' }}>
                            <button class="btn btn-primary" onClick={() => {
                                this.daysOfServicePurchaseOrders(this.refs.year.value).then((data) => {
                                    this.draw(data);
                                });
                            }}>Search</button>
                        </div>
                    </div>
                </div>
            </div>

            <canvas id="myChart" width="1600px" height="650px"></canvas>

        </div>
    }
}

export default DaysOfServicePurchaseOrders;
