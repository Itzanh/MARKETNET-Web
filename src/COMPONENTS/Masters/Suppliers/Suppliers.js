import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SupplierForm from './SupplierForm';


class Suppliers extends Component {
    constructor({ getSuppliers, addSupplier, updateSupplier, deleteSupplier, tabSuppliers, getCountryName, findLanguagesByName, findCountryByName, findCityByName,
        findPaymentMethodByName, findBillingSerieByName, getNameLanguage, getCityName, getNamePaymentMethod, getNameBillingSerie, locateAddress, getNameAddress }) {
        super();

        this.getSuppliers = getSuppliers;
        this.addSupplier = addSupplier;
        this.updateSupplier = updateSupplier;
        this.deleteSupplier = deleteSupplier;
        this.tabSuppliers = tabSuppliers;

        this.getCountryName = getCountryName;

        this.findLanguagesByName = findLanguagesByName;
        this.findCountryByName = findCountryByName;
        this.findCityByName = findCityByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameLanguage = getNameLanguage;
        this.getCityName = getCityName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.getNameBillingSerie = getNameBillingSerie;

        this.locateAddress = locateAddress;
        this.getNameAddress = getNameAddress;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getSuppliers().then(async (suppliers) => {
            await ReactDOM.render(suppliers.map((element, i) => {
                element.countryName = "...";
                return <Supplier key={i}
                    supplier={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < suppliers.length; i++) {
                if (suppliers[i].country != null) {
                    suppliers[i].countryName = await this.getCountryName(suppliers[i].country);
                } else {
                    suppliers[i].countryName = "";
                }
            }

            ReactDOM.render(suppliers.map((element, i) => {
                return <Supplier key={i}
                    supplier={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SupplierForm
                addSupplier={this.addSupplier}
                tabCustomers={this.tabSuppliers}

                findLanguagesByName={this.findLanguagesByName}
                findCountryByName={this.findCountryByName}
                findCityByName={this.findCityByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findBillingSerieByName={this.findBillingSerieByName}
            />,
            document.getElementById('renderTab'));
    }

    async edit(supplier) {
        var defaultValueNameLanguage;
        var defaultValueNameCountry;
        var defaultValueNameCity;
        var defaultValueNamePaymentMethod;
        var defaultValueNameBillingSerie;
        var defaultValueNameMainAddress;
        var defaultValueNameShippingAddress;
        var defaultValueNameBillingAddress;
        if (supplier.language != null)
            defaultValueNameLanguage = await this.getNameLanguage(supplier.language);
        if (supplier.country != null)
            defaultValueNameCountry = await this.getCountryName(supplier.country);
        if (supplier.city != null)
            defaultValueNameCity = await this.getCityName(supplier.city);
        if (supplier.paymentMethod != null)
            defaultValueNamePaymentMethod = await this.getNamePaymentMethod(supplier.paymentMethod);
        if (supplier.billingSeries != null)
            defaultValueNameBillingSerie = await this.getNameBillingSerie(supplier.billingSeries);
        if (supplier.mainAddress != null)
            defaultValueNameMainAddress = await this.getNameAddress(supplier.mainAddress);
        if (supplier.mainShippingAddress != null)
            defaultValueNameShippingAddress = await this.getNameAddress(supplier.mainShippingAddress);
        if (supplier.mainBillingAddress != null)
            defaultValueNameBillingAddress = await this.getNameAddress(supplier.mainBillingAddress);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SupplierForm
                supplier={supplier}
                tabSuppliers={this.tabSuppliers}
                updateSupplier={this.updateSupplier}
                deleteSupplier={this.deleteSupplier}

                findLanguagesByName={this.findLanguagesByName}
                findCountryByName={this.findCountryByName}
                findCityByName={this.findCityByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findBillingSerieByName={this.findBillingSerieByName}

                defaultValueNameLanguage={defaultValueNameLanguage}
                defaultValueNameCountry={defaultValueNameCountry}
                defaultValueNameCity={defaultValueNameCity}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameMainAddress={defaultValueNameMainAddress}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                defaultValueNameBillingAddress={defaultValueNameBillingAddress}

                locateAddress={this.locateAddress}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabSuppliers">
            <h1>Suppliers</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Tax ID</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Email</th>
                        <th scope="col">Country</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Supplier extends Component {
    constructor({ supplier, edit }) {
        super();

        this.supplier = supplier;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.supplier);
        }}>
            <th scope="row">{this.supplier.id}</th>
            <td>{this.supplier.name}</td>
            <td>{this.supplier.taxId}</td>
            <td>{this.supplier.Phone}</td>
            <td>{this.supplier.email}</td>
            <td>{this.supplier.countryName}</td>
        </tr>
    }
}

export default Suppliers;
