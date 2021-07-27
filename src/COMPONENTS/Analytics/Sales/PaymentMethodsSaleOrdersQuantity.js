import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';


class PaymentMethodsSaleOrdersQuantity extends Component {
    constructor({ paymentMethodsSaleOrdersAmount }) {
        super();

        this.paymentMethodsSaleOrdersAmount = paymentMethodsSaleOrdersAmount;
    }

    componentDidMount() {
        this.paymentMethodsSaleOrdersAmount("0").then((data) => {
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
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(177, 21, 21)',
                        'rgb(54, 82, 235)',
                        'rgb(210, 180, 13)'
                    ],
                    hoverOffset: 4
                }]
            }
        });
    }

    render() {
        return <div id="tabMonthlySalesAmount" className="formRowRoot">
            <h1>{i18next.t('payment-methods-of-the-sale-orders')}</h1>

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
                                this.paymentMethodsSaleOrdersAmount(this.refs.year.value).then((data) => {
                                    this.draw(data);
                                });
                            }}>Search</button>
                        </div>
                    </div>
                </div>
            </div>

            <canvas id="myChart" width="1600px" height="720px" style={{ 'maxHeight': '720px' }}></canvas>

        </div>
    }
}

export default PaymentMethodsSaleOrdersQuantity;
