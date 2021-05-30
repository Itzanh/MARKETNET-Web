import React, { Component } from 'react';

class Menu extends Component {
    constructor({ handleSalesOrders, handleSalesInvoices, handleSalesDeliveryNotes, handleCustomers, handleSuppliers, handleProducts, handleCountries, handleCities, handleColors, handleProductFamilies, handleAddresses, handleCarriers, handleBillingSeries, handleCurrencies, handlePaymentMethod, handleLanguage, handlePackages, handleIncoterms, handleWarehouse, handleWarehouseMovements, handleManufacturingOrders, handleManufacturingOrderTypes, handlePackaging, handleShipping, handleUsers, handleGroups }) {
        super();

        this.handleSalesOrders = handleSalesOrders;
        this.handleSalesInvoices = handleSalesInvoices;
        this.handleSalesDeliveryNotes = handleSalesDeliveryNotes;
        this.handleCustomers = handleCustomers;
        this.handleSuppliers = handleSuppliers;
        this.handleProducts = handleProducts;
        this.handleCountries = handleCountries;
        this.handleCities = handleCities;
        this.handleColors = handleColors;
        this.handleProductFamilies = handleProductFamilies;
        this.handleAddresses = handleAddresses;
        this.handleCarriers = handleCarriers;
        this.handleBillingSeries = handleBillingSeries;
        this.handleCurrencies = handleCurrencies;
        this.handlePaymentMethod = handlePaymentMethod;
        this.handleLanguage = handleLanguage;
        this.handlePackages = handlePackages;
        this.handleIncoterms = handleIncoterms;
        this.handleWarehouse = handleWarehouse;
        this.handleWarehouseMovements = handleWarehouseMovements;
        this.handleManufacturingOrders = handleManufacturingOrders;
        this.handleManufacturingOrderTypes = handleManufacturingOrderTypes;
        this.handlePackaging = handlePackaging;
        this.handleShipping = handleShipping;
        this.handleUsers = handleUsers;
        this.handleGroups = handleGroups;
    }

    render() {
        return <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="#">MARKETNET</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Sales
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handleSalesOrders}>Orders</a>
                                <a class="dropdown-item" href="#" onClick={this.handleSalesInvoices}>Invoices</a>
                                <a class="dropdown-item" href="#" onClick={this.handleSalesDeliveryNotes}>Delivery Notes</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Purchases
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#">Orders</a>
                                <a class="dropdown-item" href="#">Invoices</a>
                                <a class="dropdown-item" href="#">Delivery Notes</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Masters
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handleCustomers}>Customers</a>
                                <a class="dropdown-item" href="#" onClick={this.handleSuppliers}>Suppliers</a>
                                <a class="dropdown-item" href="#" onClick={this.handleProducts}>Products</a>
                                <a class="dropdown-item" href="#" onClick={this.handleCountries}>Countries</a>
                                <a class="dropdown-item" href="#" onClick={this.handleCities}>Cities</a>
                                <a class="dropdown-item" href="#" onClick={this.handleColors}>Colors</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" onClick={this.handleProductFamilies}>Product families</a>
                                <a class="dropdown-item" href="#" onClick={this.handleAddresses}>Addresses</a>
                                <a class="dropdown-item" href="#" onClick={this.handleCarriers}>Carriers</a>
                                <a class="dropdown-item" href="#" onClick={this.handleBillingSeries}>Billing series</a>
                                <a class="dropdown-item" href="#" onClick={this.handleCurrencies}>Currencies</a>
                                <a class="dropdown-item" href="#" onClick={this.handlePaymentMethod}>Payment methods</a>
                                <a class="dropdown-item" href="#" onClick={this.handleLanguage}>Languages</a>
                                <a class="dropdown-item" href="#" onClick={this.handlePackages}>Packages</a>
                                <a class="dropdown-item" href="#" onClick={this.handleIncoterms}>Incoterms</a>
                                <a class="dropdown-item" href="#">Documents</a>
                                <a class="dropdown-item" href="#">Document containers</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Warehouse
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handleWarehouse}>Warehouses</a>
                                <a class="dropdown-item" href="#" onClick={this.handleWarehouseMovements}>Warehouse movements</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Manufacturing
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handleManufacturingOrders}>Manufacturing orders</a>
                                <a class="dropdown-item" href="#" onClick={this.handleManufacturingOrderTypes}>Manufacturing order types</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Preparation
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handlePackaging}>Packaging</a>
                                <a class="dropdown-item" href="#" onClick={this.handleShipping}>Shippings</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Utils
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#">Settings</a>
                                <a class="dropdown-item" href="#" onClick={this.handleUsers}>Users</a>
                                <a class="dropdown-item" href="#" onClick={this.handleGroups}>Groups</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#">Dynamic exporter</a>
                                <a class="dropdown-item" href="#">Dynamic importer</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#">About</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
            <div id="renderTab"></div>
        </div>
    }
}

export default Menu;
