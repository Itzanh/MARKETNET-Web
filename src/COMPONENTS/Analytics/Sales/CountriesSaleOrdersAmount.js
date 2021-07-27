import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';


class CountriesSaleOrdersAmount extends Component {
    constructor({ countriesSaleOrdersAmount }) {
        super();

        this.countriesSaleOrdersAmount = countriesSaleOrdersAmount;
    }

    componentDidMount() {
        this.countriesSaleOrdersAmount("0").then((data) => {
            this.draw(data);
        });
    }

    draw(rows) {
        const data = [];
        const labels = [];

        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].quantity);
            labels.push(rows[i].countryName);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: i18next.t('sale-orders-by-country'),
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
            <h1>{i18next.t('sale-orders-by-country')}</h1>

            <canvas id="myChart" width="1600px" height="720px" style={{ 'maxHeight': '720px' }}></canvas>

        </div>
    }
}

export default CountriesSaleOrdersAmount;
