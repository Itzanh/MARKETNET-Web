import { Component } from "react";
import { Chart } from "chart.js";
import i18next from 'i18next';



class Benefits extends Component {
    constructor({ benefitsStatistics }) {
        super();

        this.benefitsStatistics = benefitsStatistics;
    }

    draw(rows) {
        console.log(rows);
        if (this.myChart != null) {
            this.myChart.destroy();
        }

        const dataSales = [];
        const labelsSales = [];

        for (let i = 0; i < rows.sales.length; i++) {
            dataSales.push(rows.sales[i].value);
            labelsSales.push(rows.sales[i].year + "-" + rows.sales[i].month);
        }

        const dataPurchases = [];

        for (let i = 0; i < rows.purchases.length; i++) {
            dataPurchases.push(rows.purchases[i].value);
        }

        const benefits = [];

        for (let i = 0; i < rows.sales.length; i++) {
            benefits.push(rows.sales[i].value - (rows.purchases[i] != undefined ? rows.purchases[i].value : 0));
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelsSales,
                datasets: [{
                    label: i18next.t('sales'),
                    data: dataSales,
                    fill: false,
                    backgroundColor: 'rgb(54 162 235)',
                    borderColor: 'rgb(54 162 235)',
                    tension: 0.1
                }, {
                    label: i18next.t('purchases'),
                    data: dataPurchases,
                    fill: true,
                    backgroundColor: 'rgb(255 99 132)',
                    borderColor: 'rgb(255 99 132)',
                    tension: 0.1
                }, {
                    label: i18next.t('benefits'),
                    type: 'bar',
                    data: benefits,
                    fill: true,
                    backgroundColor: 'rgb(111 205 205)',
                    borderColor: 'rgb(111 205 205)',
                    tension: 0.1,
                    yAxisID: 'y2',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        stack: '1',
                        beginAtZero: true,
                        labels: labelsSales,
                        stackWeight: 2
                    },
                    y2: {
                        type: 'linear',
                        position: 'left',
                        stack: '1',
                        offset: true,
                        beginAtZero: true,
                        labels: labelsSales,
                        stackWeight: 1
                    },
                }
            }
        });
    }

    render() {
        return <div id="tabBenefits" className="formRowRoot">
            <h4>{i18next.t('benefits')}</h4>

            <div class="form-row">
                <div class="col">
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('year-start')}</label>
                            <input type="number" class="form-control" defaultValue={(new Date().getFullYear())} ref="yearStart" min="1980" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('month-start')}</label>
                            <input type="number" class="form-control" defaultValue={(new Date().getMonth() + 1)} ref="monthStart" min="1" max="12" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('year-end')}</label>
                            <input type="number" class="form-control" defaultValue={(new Date().getFullYear())} ref="yearEnd" min="1980" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('month-end')}</label>
                            <input type="number" class="form-control" defaultValue={(new Date().getMonth() + 1)} ref="monthEnd" min="1" max="12" />
                        </div>
                        <div class="col" style={{ 'max-width': '100px' }}>
                            <button class="btn btn-primary" onClick={() => {
                                console.log({
                                    dateStart: new Date(parseInt(this.refs.yearStart.value), parseInt(this.refs.monthStart.value)),
                                    dateEnd: new Date(parseInt(this.refs.yearEnd.value), parseInt(this.refs.monthEnd.value)),
                                    sales: true,
                                    purchases: true,
                                });
                                this.benefitsStatistics({
                                    dateStart: new Date(parseInt(this.refs.yearStart.value), parseInt(this.refs.monthStart.value)),
                                    dateEnd: new Date(parseInt(this.refs.yearEnd.value), parseInt(this.refs.monthEnd.value)),
                                    sales: true,
                                    purchases: true,
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



export default Benefits;
