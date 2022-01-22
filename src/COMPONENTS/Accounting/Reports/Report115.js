import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';



class Report115 extends Component {
    constructor({ execReportForm115 }) {
        super();

        this.execReportForm115 = execReportForm115;
        this.result = {
            elements: [],
            totalWithDiscount: 0,
            incomeTaxBase: 0,
            incomeTaxValue: 0,
            totalAmount: 0,
        };

        this.search = this.search.bind(this);
    }

    search() {
        this.execReportForm115({
            dateStart: new Date(this.refs.dateStart.value),
            dateEnd: new Date(this.refs.dateEnd.value)
        }).then((result) => {
            for (let i = 0; i < result.elements.length; i++) {
                result.elements[i].id = i;
            }
            this.result = result;
            this.forceUpdate();
        });
    }

    render() {
        return <div id="tabReport111" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('report-115')}</h4>
            <div class="form-row mb-2">
                <div class="col">
                </div>
                <div class="col">
                    <div class="form-row" style={{ 'padding-left': '40%' }}>
                        <div class="col">
                            <label>Date start</label>
                            <input type="date" class="form-control" ref="dateStart" />
                        </div>
                        <div class="col">
                            <label>Date end</label>
                            <input type="date" class="form-control" ref="dateEnd" />
                        </div>
                        <div class="col" style={{ 'max-width': '100px' }}>
                            <button class="btn btn-primary" onClick={() => {
                                this.search();
                            }}>{i18next.t('search')}</button>
                        </div>
                    </div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.result.elements}
                columns={[
                    {
                        field: 'invoiceName', headerName: i18next.t('invoice-no'), width: 160, valueGetter: (params) => {
                            return params.row.purchaseInvoice.invoiceName;
                        }
                    },
                    {
                        field: 'supplierName', headerName: i18next.t('supplier'), width: 500, valueGetter: (params) => {
                            return params.row.supplier.name;
                        }
                    },
                    {
                        field: 'taxId', headerName: i18next.t('tax-id'), width: 250, valueGetter: (params) => {
                            return params.row.supplier.taxId;
                        }
                    },
                    {
                        field: 'address', headerName: i18next.t('address'), width: 750, valueGetter: (params) => {
                            return params.row.address.address + " " + params.row.address.address2 + " " + params.row.address.zipCode
                                + " (" + params.row.address.city + ") " + params.row.address.stateName + " " + params.row.address.countryName;
                        }
                    },
                    {
                        field: 'totalWithDiscount', headerName: i18next.t('total-with-discount'), width: 250, valueGetter: (params) => {
                            return params.row.purchaseInvoice.totalWithDiscount;
                        }
                    },
                    {
                        field: 'incomeTaxBase', headerName: i18next.t('income-tax-base'), width: 250, valueGetter: (params) => {
                            return params.row.purchaseInvoice.incomeTaxBase;
                        }
                    },
                    {
                        field: 'incomeTaxPercentage', headerName: i18next.t('income-tax-percentage'), width: 250, valueGetter: (params) => {
                            return params.row.purchaseInvoice.incomeTaxPercentage;
                        }
                    },
                    {
                        field: 'incomeTaxValue', headerName: i18next.t('income-tax-value'), width: 250, valueGetter: (params) => {
                            return params.row.purchaseInvoice.incomeTaxValue;
                        }
                    },
                    {
                        field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170, valueGetter: (params) => {
                            return params.row.purchaseInvoice.totalAmount;
                        }
                    }
                ]}
            />
        </div>
    }
}



export default Report115;
