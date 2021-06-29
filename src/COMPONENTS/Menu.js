import React, { Component } from 'react';

class Menu extends Component {
    constructor({ handleSalesOrders, handleSalesInvoices, handleSalesDeliveryNotes, handlePurchaseOrders, handlePurchaseInvoices, handlePurchaseDeliveryNotes, handleNeeds, handleCustomers, handleSuppliers, handleProducts, handleCountries, handleStates, handleColors, handleProductFamilies, handleAddresses, handleCarriers, handleBillingSeries, handleCurrencies, handlePaymentMethod, handleLanguage, handlePackages, handleIncoterms, handleDocuments, handleDocumentContainers, handleWarehouse, handleWarehouseMovements, handleManufacturingOrders, handleManufacturingOrderTypes, handlePackaging, handleShipping, handleSettings, handleUsers, handleDynamicExporter, handleDynamicImporter, handleAbout, handleGroups, handleConnections, handleImport, handlePSZones, prestaShopVisible, permissions, logout }) {
        super();

        this.handleSalesOrders = handleSalesOrders;
        this.handleSalesInvoices = handleSalesInvoices;
        this.handleSalesDeliveryNotes = handleSalesDeliveryNotes;
        this.handlePurchaseOrders = handlePurchaseOrders;
        this.handlePurchaseInvoices = handlePurchaseInvoices;
        this.handlePurchaseDeliveryNotes = handlePurchaseDeliveryNotes;
        this.handleNeeds = handleNeeds;
        this.handleCustomers = handleCustomers;
        this.handleSuppliers = handleSuppliers;
        this.handleProducts = handleProducts;
        this.handleCountries = handleCountries;
        this.handleStates = handleStates;
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
        this.handleDocuments = handleDocuments;
        this.handleDocumentContainers = handleDocumentContainers;
        this.handleWarehouse = handleWarehouse;
        this.handleWarehouseMovements = handleWarehouseMovements;
        this.handleManufacturingOrders = handleManufacturingOrders;
        this.handleManufacturingOrderTypes = handleManufacturingOrderTypes;
        this.handlePackaging = handlePackaging;
        this.handleShipping = handleShipping;
        this.handleSettings = handleSettings;
        this.handleUsers = handleUsers;
        this.handleGroups = handleGroups;
        this.handleConnections = handleConnections;
        this.handleDynamicExporter = handleDynamicExporter;
        this.handleDynamicImporter = handleDynamicImporter;
        this.handleAbout = handleAbout;
        this.handleImport = handleImport;
        this.handlePSZones = handlePSZones;
        this.prestaShopVisible = prestaShopVisible;
        this.permissions = permissions;
        this.logout = logout;
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
                        {!this.permissions.sales ? null : < li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Sales
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handleSalesOrders}>Orders</a>
                                <a class="dropdown-item" href="#" onClick={this.handleSalesInvoices}>Invoices</a>
                                <a class="dropdown-item" href="#" onClick={this.handleSalesDeliveryNotes}>Delivery Notes</a>
                            </div>
                        </li>}
                        {!this.permissions.purchases ? null : < li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Purchases
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handlePurchaseOrders}>Orders</a>
                                <a class="dropdown-item" href="#" onClick={this.handlePurchaseInvoices}>Invoices</a>
                                <a class="dropdown-item" href="#" onClick={this.handlePurchaseDeliveryNotes}>Delivery Notes</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" onClick={this.handleNeeds}>Needs</a>
                            </div>
                        </li>}
                        {!this.permissions.masters ? null : < li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Masters
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handleCustomers}>Customers</a>
                                <a class="dropdown-item" href="#" onClick={this.handleSuppliers}>Suppliers</a>
                                <a class="dropdown-item" href="#" onClick={this.handleProducts}>Products</a>
                                <a class="dropdown-item" href="#" onClick={this.handleCountries}>Countries</a>
                                <a class="dropdown-item" href="#" onClick={this.handleStates}>States</a>
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
                                <a class="dropdown-item" href="#" onClick={this.handleDocuments}>Documents</a>
                                <a class="dropdown-item" href="#" onClick={this.handleDocumentContainers}>Document containers</a>
                            </div>
                        </li>}
                        {!this.permissions.warehouse ? null : < li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Warehouse
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handleWarehouse}>Warehouses</a>
                                <a class="dropdown-item" href="#" onClick={this.handleWarehouseMovements}>Warehouse movements</a>
                            </div>
                        </li>}
                        {!this.permissions.manufacturing ? null : < li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Manufacturing
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handleManufacturingOrders}>Manufacturing orders</a>
                                <a class="dropdown-item" href="#" onClick={this.handleManufacturingOrderTypes}>Manufacturing order types</a>
                            </div>
                        </li>}
                        {!this.permissions.preparation ? null : < li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Preparation
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handlePackaging}>Packaging</a>
                                <a class="dropdown-item" href="#" onClick={this.handleShipping}>Shippings</a>
                            </div>
                        </li>}
                        {!this.permissions.admin ? null : < li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Utils
                        </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" onClick={this.handleSettings}>Settings</a>
                                <a class="dropdown-item" href="#" onClick={this.handleUsers}>Users</a>
                                <a class="dropdown-item" href="#" onClick={this.handleGroups}>Groups</a>
                                <a class="dropdown-item" href="#" onClick={this.handleConnections}>Connections</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" onClick={this.handleDynamicExporter}>Dynamic exporter</a>
                                <a class="dropdown-item" href="#" onClick={this.handleDynamicImporter}>Dynamic importer</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" onClick={this.handleAbout}>About</a>
                            </div>
                        </li>}
                        {!this.prestaShopVisible || !this.permissions.prestashop ? null :
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    PrestaShop
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="#" onClick={this.handleImport}>Import</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="#" onClick={this.handlePSZones}>PrestaShop zones</a>
                                </div>
                            </li>}
                    </ul>
                    <form class="form-inline">
                        <button class="btn btn-outline-danger my-2 my-sm-0" type="submit" onClick={this.logout}>Logout</button>
                    </form>
                </div>
            </nav>
            <div id="contextMenu"></div>
            <div id="renderTab"></div>
        </div>
    }
}

export default Menu;
