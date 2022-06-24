/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';



class DailyShippingQuantity extends Component {
    constructor({ dailyShippingQuantity }) {
        super();

        this.dailyShippingQuantity = dailyShippingQuantity;
    }

    componentDidMount() {
        this.dailyShippingQuantity().then((data) => {
            this.draw(data);
        });
    }

    draw(rows) {
        const data = [];
        const labels = [];

        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].quantity);
            const date = new Date(rows[i].date);
            labels.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: i18next.t('daily-shippings'),
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
            <h4>{i18next.t('daily-shippings')}</h4>

            <canvas id="myChart" width="1600px" height="720px"></canvas>

        </div>
    }
}



export default DailyShippingQuantity;
