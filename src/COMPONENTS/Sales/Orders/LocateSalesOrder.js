import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';



class LocateSalesOrder extends Component {
    constructor({ locateSaleOrder, handleSelect }) {
        super();

        this.locateSaleOrder = locateSaleOrder;
        this.handleSelect = handleSelect;

        this.list = [];
        this.rows = 0;
        this.limit = 100;
        this.offset = 0;

        this.select = this.select.bind(this);
    }

    componentDidMount() {
        window.$('#saleOrderModal').modal({ show: true });

        this.renderOrders();
    }

    renderOrders() {
        this.locateSaleOrder({
            limit: this.limit,
            offset: this.offset
        }).then((orders) => {
            this.list = orders.orders;
            this.rows = orders.rows;
            this.forceUpdate();
        });
    }

    select(order) {
        window.$('#saleOrderModal').modal('hide');
        this.handleSelect(order.id, order.orderName, order.customer);
    }

    render() {
        return <div class="modal fade" id="saleOrderModal" tabindex="-1" role="dialog" aria-labelledby="saleOrderModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="saleOrderModalLabel">{i18next.t('locate-sale-order')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">{i18next.t('customer')}</th>
                                    <th scope="col">{i18next.t('order-name')}</th>
                                    <th scope="col">{i18next.t('date-created')}</th>
                                </tr>
                            </thead>
                            <tbody ref="render"></tbody>
                        </table>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
                            columns={[
                                { field: 'orderName', headerName: i18next.t('order-no'), width: 160 },
                                { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
                                {
                                    field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                        return window.dateFormat(params.row.dateCreated)
                                    }
                                },
                            ]}
                            onRowClick={(data) => {
                                this.select(data.row);
                            }}
                            page={this.offset / this.limit}
                            pageSize={this.limit}
                            onPageChange={(data) => {
                                this.offset = data * this.limit;
                                this.renderOrders();
                            }}
                            rowCount={this.rows}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default LocateSalesOrder;
