/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';



class MonthlySalesAmount extends Component {
    constructor({ monthlySalesAmount }) {
        super();

        this.monthlySalesAmount = monthlySalesAmount;
    }

    componentDidMount() {
        this.monthlySalesAmount({}).then((data) => {
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
            data.push(rows[i].amount);
            labels.push(rows[i].year + "-" + rows[i].month + "-" + rows[i].day);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: i18next.t('monthly-sales-amount'),
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
        return <div id="tabMonthlySalesAmount" className="formRowRoot">
            <h4>{i18next.t('monthly-sales-amount')}</h4>

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
                                this.monthlySalesAmount({
                                    dateStart: new Date(this.refs.start.value),
                                    dateEnd: new Date(this.refs.end.value)
                                }).then((data) => {
                                    this.draw(data);
                                });
                            }}>{i18next.t('search')}</button>
                        </div>
                    </div>
                </div>
            </div>

            <canvas id="myChart" width="1600px" height="650px"></canvas>

        </div>
    }
}



export default MonthlySalesAmount;
