/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';


class ManufacturingQuantity extends Component {
    constructor({ manufacturingOrderCreatedManufacturedDaily }) {
        super();

        this.manufacturingOrderCreatedManufacturedDaily = manufacturingOrderCreatedManufacturedDaily;
    }

    componentDidMount() {
        this.manufacturingOrderCreatedManufacturedDaily({}).then((data) => {
            this.draw(data);
        });
    }

    draw(rows) {
        if (this.myChart != null) {
            this.myChart.destroy();
        }

        const dataCreated = [];
        const labelsCreated = [];

        for (let i = 0; i < rows.created.length; i++) {
            dataCreated.push(rows.created[i].quantity);
            const date = new Date(rows.created[i].date);
            labelsCreated.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
        }

        const dataManufactured = [];

        for (let i = 0; i < rows.created.length; i++) {
            dataManufactured.push(rows.created[i].quantity);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelsCreated,
                datasets: [{
                    label: i18next.t('manufacturing-orders-created'),
                    data: dataCreated,
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: i18next.t('manufacturing-orders-manufactured'),
                    data: dataManufactured,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
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
            <h4>{i18next.t('manufacturing-orders-created-manufactured')}</h4>

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
                                this.manufacturingOrderCreatedManufacturedDaily({
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

export default ManufacturingQuantity;
