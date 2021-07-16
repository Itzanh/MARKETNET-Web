import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import { Button } from "@material-ui/core";

class SalesOrderDiscounts extends Component {
    constructor({ orderId, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderDiscounts = getSalesOrderDiscounts;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;
        this.deleteSalesOrderDiscounts = deleteSalesOrderDiscounts;

        this.list = [];

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.renderSalesOrderDiscounts();
    }

    renderSalesOrderDiscounts() {
        this.getSalesOrderDiscounts(this.orderId).then((discounts) => {
            this.list = discounts;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDiscountsModal'));
        ReactDOM.render(
            <SalesOrderDiscountModal
                orderId={this.orderId}
                addSalesOrderDiscounts={(discount) => {
                    const promise = this.addSalesOrderDiscounts(discount);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderSalesOrderDiscounts();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('salesOrderDiscountsModal'));
    }

    render() {
        return <div id="salesOrderDiscounts">
            <div id="salesOrderDiscountsModal"></div>
            <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'valueTaxExcluded', headerName: i18next.t('value-tax-excluded'), width: 300 },
                    { field: 'valueTaxIncluded', headerName: i18next.t('value-tax-included'), width: 300 },
                    {
                        field: "", width: 130, renderCell: (params) => (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 16 }}
                                onClick={() => {
                                    this.deleteSalesOrderDiscounts(params.row.id).then(() => {
                                        this.renderSalesOrderDiscounts();
                                    });
                                }}
                            >
                                {i18next.t('delete')}
                            </Button>
                        ),
                    }
                ]}
            />
        </div>
    }
}

class SalesOrderDiscountModal extends Component {
    constructor({ orderId, addSalesOrderDiscounts }) {
        super();

        this.orderId = orderId;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        window.$('#discountModal').modal({ show: true });
    }

    getDiscountFromForm() {
        const discount = {};
        discount.order = this.orderId;
        discount.name = this.refs.name.value;
        discount.valueTaxIncluded = parseFloat(this.refs.valueTaxIncluded.value);
        discount.valueTaxExcluded = parseFloat(this.refs.valueTaxExcluded.value);
        return discount;
    }

    add() {
        this.addSalesOrderDiscounts(this.getDiscountFromForm()).then((ok) => {
            if (ok) {
                window.$('#discountModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="discountModal" tabindex="-1" role="dialog" aria-labelledby="discountModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="discountModalLabel">{i18next.t('add-order-discount')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('value-tax-excluded')}</label>
                                <input type="number" class="form-control" ref="valueTaxExcluded" min="0" defaultValue="0" />
                            </div>
                            <div class="col">
                                <label>{i18next.t('value-tax-included')}</label>
                                <input type="number" class="form-control" ref="valueTaxIncluded" min="0" defaultValue="0" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SalesOrderDiscounts;
