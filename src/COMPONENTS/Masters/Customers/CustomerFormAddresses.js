import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class CustomerFormAddresses extends Component {
    constructor({ customerId, getCustomerAddresses }) {
        super();

        this.list = [];

        this.customerId = customerId;
        this.getCustomerAddresses = getCustomerAddresses;
    }

    componentDidMount() {
        if (this.customerId == null) {
            return;
        }

        this.getCustomerAddresses(this.customerId).then((addresses) => {
            this.list = addresses;
            this.forceUpdate();
        });
    }

    render() {
        return <DataGrid
            ref="table"
            autoHeight
            rows={this.list}
            columns={[
                { field: 'id', headerName: '#', width: 90 },
                { field: 'contactName', headerName: i18next.t('customer'), flex: 1 },
                { field: 'address', headerName: i18next.t('address'), width: 500 },
                { field: 'countryName', headerName: i18next.t('country'), width: 150 },
                { field: 'stateName', headerName: i18next.t('state'), width: 250 }
            ]}
        />
    }
}

export default CustomerFormAddresses;
