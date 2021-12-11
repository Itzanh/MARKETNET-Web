import React, { Component } from 'react';
import i18next from 'i18next';

class Menu extends Component {
    constructor({ handleSalesOrders, handleSalesInvoices, handleSalesDeliveryNotes, handlePurchaseOrders, handlePurchaseInvoices, handlePurchaseDeliveryNotes, handleNeeds, handleCustomers, handleSuppliers, handleProducts, handleCountries, handleStates, handleColors, handleProductFamilies, handleAddresses, handleCarriers, handleBillingSeries, handleCurrencies, handlePaymentMethod, handleLanguage, handlePackages, handleIncoterms, handleDocuments, handleDocumentContainers, handleWarehouse, handleWarehouseMovements, handleManufacturingOrders, handleManufacturingOrderTypes, handlePackaging, handleShipping, handleCollectShipping, handleSettings, handleUsers, handleAbout, handleGroups, handleConnections, handleImportFromPrestaShop, handlePSZones, prestaShopVisible, permissions, logout, handleJournals, handleAccounts, handleAccountingMovements, handlePostSalesInvoices, handlePostPurchaseInvoices, handleCharges, handlePayments, handleMonthlySalesAmount, handleMonthlySalesQuantity, handleSalesOfAProductQuantity, handleSalesOfAProductAmount, handleDaysOfServiceSaleOrders, handleDaysOfServicePurchaseOrders, handleMonthlyPurchaseAmount, handlePaymentMethodsSaleOrdersQuantity, handleCountriesSaleOrdersAmount, handleManufacturingQuantity, handleDailyShippingQuantity, handleShippingsByCarrier, handleApiKeys, wooCommerceVisible, handleImportFromWooCommerce, handleConnectionLog, handleConnectionFilters, shopifyVisible, handleImportFromShopify, tabReportTemplates, tabEmailLogs, handleChangePassword, handleComplexManufacturingOrders, menu }) {
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
        this.handleCollectShipping = handleCollectShipping;
        this.handleSettings = handleSettings;
        this.handleUsers = handleUsers;
        this.handleGroups = handleGroups;
        this.handleConnections = handleConnections;
        this.handleAbout = handleAbout;
        this.handleImportFromPrestaShop = handleImportFromPrestaShop;
        this.handlePSZones = handlePSZones;
        this.prestaShopVisible = prestaShopVisible;
        this.permissions = permissions;
        this.logout = logout;
        this.handleJournals = handleJournals;
        this.handleAccounts = handleAccounts;
        this.handleAccountingMovements = handleAccountingMovements;
        this.handlePostSalesInvoices = handlePostSalesInvoices;
        this.handlePostPurchaseInvoices = handlePostPurchaseInvoices;
        this.handleCharges = handleCharges;
        this.handlePayments = handlePayments;
        this.handleMonthlySalesAmount = handleMonthlySalesAmount;
        this.handleMonthlySalesQuantity = handleMonthlySalesQuantity;
        this.handleSalesOfAProductQuantity = handleSalesOfAProductQuantity;
        this.handleSalesOfAProductAmount = handleSalesOfAProductAmount;
        this.handleDaysOfServiceSaleOrders = handleDaysOfServiceSaleOrders;
        this.handleDaysOfServicePurchaseOrders = handleDaysOfServicePurchaseOrders;
        this.handleMonthlyPurchaseAmount = handleMonthlyPurchaseAmount;
        this.handlePaymentMethodsSaleOrdersQuantity = handlePaymentMethodsSaleOrdersQuantity;
        this.handleCountriesSaleOrdersAmount = handleCountriesSaleOrdersAmount;
        this.handleManufacturingQuantity = handleManufacturingQuantity;
        this.handleDailyShippingQuantity = handleDailyShippingQuantity;
        this.handleShippingsByCarrier = handleShippingsByCarrier;
        this.handleApiKeys = handleApiKeys;
        this.wooCommerceVisible = wooCommerceVisible;
        this.handleImportFromWooCommerce = handleImportFromWooCommerce;
        this.handleConnectionLog = handleConnectionLog;
        this.handleConnectionFilters = handleConnectionFilters;
        this.shopifyVisible = shopifyVisible;
        this.handleImportFromShopify = handleImportFromShopify;
        this.handleReportTemplates = tabReportTemplates;
        this.handleEmailLogs = tabEmailLogs;
        this.handleChangePassword = handleChangePassword;
        this.handleComplexManufacturingOrders = handleComplexManufacturingOrders;

        this.menu = menu != undefined ? menu : "M"; // M = Management, A = Accounting
    }

    management() {
        return <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
                {!this.permissions.sales ? null : <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('sales')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleSalesOrders}>{i18next.t('orders')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleSalesInvoices}>{i18next.t('invoices')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleSalesDeliveryNotes}>{i18next.t('delivery-notes')}</a>
                    </div>
                </li>}
                {!this.permissions.purchases ? null : <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('purchases')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handlePurchaseOrders}>{i18next.t('orders')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handlePurchaseInvoices}>{i18next.t('invoices')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handlePurchaseDeliveryNotes}>{i18next.t('delivery-notes')}</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" onClick={this.handleNeeds}>{i18next.t('needs')}</a>
                    </div>
                </li>}
                {!this.permissions.masters ? null : <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('masters')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleCustomers}>{i18next.t('customers')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleSuppliers}>{i18next.t('suppliers')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleProducts}>{i18next.t('products')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleCountries}>{i18next.t('countries')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleStates}>{i18next.t('states')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleColors}>{i18next.t('colors')}</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" onClick={this.handleProductFamilies}>{i18next.t('product-families')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleAddresses}>{i18next.t('addresses')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleCarriers}>{i18next.t('carriers')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleBillingSeries}>{i18next.t('billing-series')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleCurrencies}>{i18next.t('currencies')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handlePaymentMethod}>{i18next.t('payment-methods')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleLanguage}>{i18next.t('languages')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handlePackages}>{i18next.t('packages')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleIncoterms}>{i18next.t('incoterms')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleDocuments}>{i18next.t('documents')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleDocumentContainers}>{i18next.t('document-containers')}</a>
                    </div>
                </li>}
                {!this.permissions.warehouse ? null : <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('warehouse')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleWarehouse}>{i18next.t('warehouses')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleWarehouseMovements}>{i18next.t('warehouse-movements')}</a>
                    </div>
                </li>}
                {!this.permissions.manufacturing ? null : <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('manufacturing')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleManufacturingOrders}>{i18next.t('manufacturing-orders')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleManufacturingOrderTypes}>{i18next.t('manufacturing-order-types')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleComplexManufacturingOrders}>{i18next.t('complex-manufacturing-orders')}</a>
                    </div>
                </li>}
                {!this.permissions.preparation ? null : <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('preparation')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handlePackaging}>{i18next.t('packaging')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleShipping}>{i18next.t('shippings')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleCollectShipping}>{i18next.t('collect-shippings')}</a>
                    </div>
                </li>}
                {!this.permissions.admin ? null : <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('utils')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleSettings}>{i18next.t('settings')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleUsers}>{i18next.t('users')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleGroups}>{i18next.t('groups')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleConnections}>{i18next.t('connections')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleApiKeys}>{i18next.t('api-keys')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleReportTemplates}>{i18next.t('report-templates')}</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" onClick={this.handleConnectionLog}>{i18next.t('connection-log')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleConnectionFilters}>{i18next.t('connection-filters')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleEmailLogs}>{i18next.t('email-logs')}</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" onClick={this.handleAbout}>{i18next.t('about')}</a>
                    </div>
                </li>}
                {!this.prestaShopVisible || !this.permissions.prestashop ? null :
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('prestaShop')}
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="#" onClick={this.handleImportFromPrestaShop}>{i18next.t('import')}</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#" onClick={this.handlePSZones}>{i18next.t('prestaShop-zones')}</a>
                        </div>
                    </li>}
                {!this.wooCommerceVisible || !this.permissions.admin ? null :
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            WooCommerce
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="#" onClick={this.handleImportFromWooCommerce}>{i18next.t('import')}</a>
                        </div>
                    </li>}
                {!this.shopifyVisible || !this.permissions.admin ? null :
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Shopify
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="#" onClick={this.handleImportFromShopify}>{i18next.t('import')}</a>
                        </div>
                    </li>}
            </ul>
            <form class="form-inline">
                <div class="dropdown">
                    <button class="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('management')}
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" onClick={() => { this.setMenu("M") }}>{i18next.t('management')}</a>
                        {!this.permissions.accounting ? null :
                            <a class="dropdown-item" href="#" onClick={() => { this.setMenu("A") }}>{i18next.t('accounting')}</a>}
                        <a class="dropdown-item" href="#" onClick={() => { this.setMenu("N") }}>{i18next.t('analytics')}</a>
                    </div>
                </div>
                <div class="btn-group my-2 my-sm-0 ml-2" role="group" aria-label="Button group with nested dropdown">
                    <div class="btn-group" role="group">
                        <button id="btnGroupDrop1" type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        </button>
                        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                            <a class="dropdown-item" href="#" onClick={this.handleChangePassword}>{i18next.t('change-password')}</a>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger" type="submit" onClick={this.logout}>{i18next.t('logout')}</button>
                </div>
            </form>
        </div>
    }

    accounting() {
        return <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('sales')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handlePostSalesInvoices}>{i18next.t('post-invoices')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleCharges}>{i18next.t('charges')}</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('purchases')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handlePostPurchaseInvoices}>{i18next.t('post-invoices')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handlePayments}>{i18next.t('payments')}</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('accounting-movements')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleAccountingMovements}>{i18next.t('accounting-movements')}</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('masters')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleJournals}>{i18next.t('journals')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleAccounts}>{i18next.t('accounts')}</a>
                    </div>
                </li>
            </ul>
            <form class="form-inline">
                <div class="dropdown">
                    <button class="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('accounting')}
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" onClick={() => { this.setMenu("M") }}>{i18next.t('management')}</a>
                        <a class="dropdown-item" href="#" onClick={() => { this.setMenu("A") }}>{i18next.t('accounting')}</a>
                        <a class="dropdown-item" href="#" onClick={() => { this.setMenu("N") }}>{i18next.t('analytics')}</a>
                    </div>
                </div>
                <button class="btn btn-outline-danger my-2 my-sm-0 ml-2" type="submit" onClick={this.logout}>{i18next.t('logout')}</button>
            </form>
        </div>
    }

    analytics() {
        return <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('sales')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleMonthlySalesAmount}>{i18next.t('monthly-sales-amount')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleMonthlySalesQuantity}>{i18next.t('monthly-sales-quantity')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleSalesOfAProductQuantity}>{i18next.t('sales-of-a-product-quantity')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleSalesOfAProductAmount}>{i18next.t('sales-of-a-product-amount')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleDaysOfServiceSaleOrders}>{i18next.t('days-of-service-sale-orders')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handlePaymentMethodsSaleOrdersQuantity}>{i18next.t('payment-methods-of-the-sale-orders')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleCountriesSaleOrdersAmount}>{i18next.t('sale-orders-by-country')}</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('purchases')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleDaysOfServicePurchaseOrders}>{i18next.t('days-of-service-purchase-orders')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleMonthlyPurchaseAmount}>{i18next.t('monthly-purchases-amount')}</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('manufacturing')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleManufacturingQuantity}>{i18next.t('manufacturing-orders-created-manufactured')}</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('preparation')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" onClick={this.handleDailyShippingQuantity}>{i18next.t('daily-shippings')}</a>
                        <a class="dropdown-item" href="#" onClick={this.handleShippingsByCarrier}>{i18next.t('shippings-by-carrier')}</a>
                    </div>
                </li>
            </ul>
            <form class="form-inline">
                <div class="dropdown">
                    <button class="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {i18next.t('analytics')}
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" onClick={() => { this.setMenu("M") }}>{i18next.t('management')}</a>
                        <a class="dropdown-item" href="#" onClick={() => { this.setMenu("A") }}>{i18next.t('accounting')}</a>
                        <a class="dropdown-item" href="#" onClick={() => { this.setMenu("N") }}>{i18next.t('analytics')}</a>
                    </div>
                </div>
                <button class="btn btn-outline-danger my-2 my-sm-0 ml-2" type="submit" onClick={this.logout}>{i18next.t('logout')}</button>
            </form>
        </div>
    }

    setMenu(menu) {
        this.menu = menu;
        this.forceUpdate();
    }

    render() {
        return <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="#">MARKETNET</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                {this.menu == "M" ? this.management() : (this.menu == "A" ? this.accounting() : (this.menu == "N" ? this.analytics() : null))}

            </nav>
            <div id="contextMenu"></div>
            <div id="renderTab"></div>
        </div>
    }
}

export default Menu;
