import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class CustomerFormAddresses extends Component {
    constructor({ customerId, getCustomerAddresses }) {
        super();

        this.customerId = customerId;
        this.getCustomerAddresses = getCustomerAddresses;
    }

    componentDidMount() {
        if (this.customerId == null) {
            return;
        }

        this.getCustomerAddresses(this.customerId).then((addresses) => {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(addresses.map((element, i) => {
                return <Address key={i}
                    address={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    render() {
        return <table class="table table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{i18next.t('customer')} / {i18next.t('supplier')}</th>
                    <th scope="col">{i18next.t('address')}</th>
                    <th scope="col">{i18next.t('country')}</th>
                    <th scope="col">{i18next.t('state')}</th>
                </tr>
            </thead>
            <tbody ref="render"></tbody>
        </table>
    }
}

class Address extends Component {
    constructor({ address, edit }) {
        super();

        this.address = address;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.address);
        }}>
            <th scope="row">{this.address.id}</th>
            <td>{this.address.contactName}</td>
            <td>{this.address.address}</td>
            <td>{this.address.countryName}</td>
            <td>{this.address.stateName}</td>
        </tr>
    }
}

export default CustomerFormAddresses;
