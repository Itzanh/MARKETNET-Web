import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class CollectShippings extends Component {
    constructor({ getShippings, setShippingCollected }) {
        super();

        this.getShippings = getShippings;
        this.setShippingCollected = setShippingCollected;

        this.list = [];
        this.selectedShippings = [];

        this.collected = this.collected.bind(this);
    }

    componentDidMount() {
        this.getShippings().then((shippings) => {
            this.list = shippings;
            this.renderShipping(shippings);
        });
    }

    renderShipping(shippings) {
        this.list = shippings;
        this.forceUpdate();
    }

    async collected() {
        await this.setShippingCollected(this.selectedShippings);
        this.getShippings().then((shippings) => {
            this.list = shippings;
            this.renderShipping(shippings);
        });
    }

    render() {
        return <div id="tabShippings" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('collect-shippings')}</h4>
            <button type="button" class="btn btn-danger ml-2 mb-2" onClick={this.collected}>{i18next.t('set-selected-as-collected')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
                    { field: 'saleOrderName', headerName: i18next.t('sale-order'), width: 200 },
                    { field: 'carrierName', headerName: i18next.t('carrier'), width: 250 },
                    { field: 'weight', headerName: i18next.t('weight'), width: 150 },
                    { field: 'packagesNumber', headerName: i18next.t('n-packages'), width: 175 },
                    { field: 'trackingNumber', headerName: 'Tracking', width: 250 },
                    { field: 'sent', headerName: i18next.t('sent'), width: 150, type: 'boolean' }
                ]}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(data) => {
                    if (this.selectedShippings.indexOf(data) < 0) {
                        this.selectedShippings.push(data[0]);
                    } else {
                        this.selectedShippings.splice(this.selectedShippings.indexOf(data[0]), 1);
                    }
                }}
            />
        </div>
    }
}

export default CollectShippings;
