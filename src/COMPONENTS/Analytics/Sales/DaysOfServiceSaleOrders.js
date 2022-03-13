import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';

class DaysOfServiceSaleOrders extends Component {
    constructor({ daysOfServiceSaleOrders }) {
        super();

        this.daysOfServiceSaleOrders = daysOfServiceSaleOrders;
    }

    componentDidMount() {
        this.daysOfServiceSaleOrders("0").then((data) => {
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
                    label: i18next.t('days-of-service-sale-orders'),
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

    render() {
        return <div id="tabMonthlySalesQuantity" className="formRowRoot">
            <h4>{i18next.t('days-of-service-sale-orders')}</h4>

            <div class="form-row">
                <div class="col">
                </div>
                <div class="col" style={{ 'padding-left': '50%' }}>
                    <div class="form-row">
                        <div class="col" style={{ 'max-width': '250px' }}>
                            <label>{i18next.t('year')}</label>
                            <input type="number" class="form-control" defaultValue="0" ref="year" />
                        </div>
                        <div class="col" style={{ 'max-width': '100px' }}>
                            <button class="btn btn-primary" onClick={() => {
                                this.daysOfServiceSaleOrders(this.refs.year.value).then((data) => {
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

export default DaysOfServiceSaleOrders;
