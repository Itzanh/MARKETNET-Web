import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';


class ManufacturingQuantity extends Component {
    constructor({ manufacturingOrderCreatedManufacturedDaily }) {
        super();

        this.manufacturingOrderCreatedManufacturedDaily = manufacturingOrderCreatedManufacturedDaily;
    }

    componentDidMount() {
        this.manufacturingOrderCreatedManufacturedDaily("0").then((data) => {
            this.draw(data);
        });
    }

    draw(rows) {
        const dataCreated = [];
        const labelsCreated = [];

        for (let i = 0; i < rows.created.length; i++) {
            dataCreated.push(rows.created[i].quantity);
            const date = new Date(rows.created[i].date);
            labelsCreated.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
        }

        const dataManufactured = [];

        for (let i = 0; i < rows.manufactured.length; i++) {
            dataManufactured.push(rows.created[i].quantity);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelsCreated,
                datasets: [{
                    label: i18next.t('manufacturing-orders-created-manufactured'),
                    data: dataCreated,
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: "Manufacturing orders manufactured",
                    data: dataManufactured,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
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
            <h1>{i18next.t('manufacturing-orders-created-manufactured')}</h1>

            <canvas id="myChart" width="1600px" height="720px"></canvas>

        </div>
    }
}

export default ManufacturingQuantity;
