import React from 'react';
import ReactDOM from 'react-dom';
import dateFormat from './date.format.js'
import './index.css';
import App from './App';
import Menu from './COMPONENTS/Menu';
import SalesOrders from './COMPONENTS/Sales/Orders/SalesOrders';
import Addresses from './COMPONENTS/Masters/Addresses/Addresses';
import BillingSeries from './COMPONENTS/Masters/BillingSeries/BillingSeries';
import Currencies from './COMPONENTS/Masters/Currencies/Currencies';
import PaymentMethods from './COMPONENTS/Masters/PaymentMethod/PaymentMethods';
import Warehouses from './COMPONENTS/Warehouse/Warehouse/Warehouses';
import Languages from './COMPONENTS/Masters/Languages/Languages';
import Countries from './COMPONENTS/Masters/Countries/Countries';
import Cities from './COMPONENTS/Masters/Cities/Cities';
import Colors from './COMPONENTS/Masters/Colors/Colors';
import Customers from './COMPONENTS/Masters/Customers/Customers';
import Products from './COMPONENTS/Masters/Products/Products';
import ProductFamilies from './COMPONENTS/Masters/ProductFamilies/ProductFamilies';
import SalesInvoices from './COMPONENTS/Sales/Invoice/SalesInvoices.js';
import ManufacturingOrderTypes from './COMPONENTS/Manufacturing/OrderTypes/ManufacturingOrderTypes.js';
import ManufacturingOrders from './COMPONENTS/Manufacturing/Orders/ManufacturingOrders.js';
import PackagingMenu from './COMPONENTS/Preparation/Packaging/PackagingMenu.js';
import Packages from './COMPONENTS/Masters/Packages/Packages.js';
import WarehouseMovements from './COMPONENTS/Warehouse/WarehouseMovements/WarehouseMovements.js';
import SalesDeliveryNotes from './COMPONENTS/Sales/DeliveryNotes/SalesDeliveryNotes.js';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

var ws;

function main() {
    ws = new WebSocket('ws://localhost:12279/')
    console.log(ws);
    ws.onopen = () => {
        ReactDOM.render(
            <Menu
                handleSalesOrders={tabSalesOrders}
                handleSalesInvoices={tabSalesInvoices}
                handleSalesDeliveryNotes={tabSalesDeliveryNotes}
                handleCustomers={tabCustomers}
                handleProducts={tabProducts}
                handleCountries={tabCountries}
                handleCities={tabCities}
                handleColors={tabColors}
                handleProductFamilies={tabProductFamilies}
                handleAddresses={tabAddresses}
                handleBillingSeries={tabBillingSeries}
                handleCurrencies={tabCurrencies}
                handlePaymentMethod={tabPaymentMethod}
                handleLanguage={tabLanguages}
                handlePackages={tabPackages}
                handleWarehouse={tabWarehouses}
                handleWarehouseMovements={tabWarehouseMovements}
                handleManufacturingOrders={tabManufacturingOrders}
                handleManufacturingOrderTypes={tabManufacturingOrderTypes}
                handlePackaging={tabPackaging}
            />,
            document.getElementById('root')
        );
    }
}

window.dateFormat = (date) => {
    return dateFormat(date, "yyyy-mm-dd hh:MM:ss");
}

function getRows(resource, extraData = "") {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('GET:' + resource + '$' + extraData);
    });
}

function addRows(resource, rowObject) {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('INSERT:' + resource + '$' + JSON.stringify(rowObject));
    });
}

function updateRows(resource, rowObject) {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('UPDATE:' + resource + '$' + JSON.stringify(rowObject));
    });
}

function deleteRows(resource, rowId) {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('DELETE:' + resource + '$' + rowId);
    });
}

function nameRecord(resource, searchName) {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('NAME:' + resource + '$' + searchName);
    });
}

function getRecordName(resource, rowId) {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(msg.data);
        }
        ws.send('GETNAME:' + resource + '$' + rowId);
    });
}

function getResourceDefaults(resource, extraData = "") {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('DEFAULTS:' + resource + '$' + extraData);
    });
}

function executeAction(resource, extraData = "") {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('ACTION:' + resource + '$' + extraData);
    });
}



/* SALES ORDERS */

function tabSalesOrders() {
    ReactDOM.render(
        <SalesOrders
            findCustomerByName={findCustomerByName}
            getCustomerName={getCustomerName}
            findPaymentMethodByName={findPaymentMethodByName}
            getNamePaymentMethod={getNamePaymentMethod}
            findCurrencyByName={findCurrencyByName}
            getNameCurrency={getNameCurrency}
            findBillingSerieByName={findBillingSerieByName}
            getNameBillingSerie={getNameBillingSerie}
            getCustomerDefaults={getCustomerDefaults}
            locateAddress={locateAddress}
            tabSalesOrders={tabSalesOrders}
            getSalesOrder={getSalesOrder}
            addSalesOrder={addSalesOrder}
            updateSalesOrder={updateSalesOrder}
            deleteSalesOrder={deleteSalesOrder}
            getNameAddress={getNameAddress}
            getOrderDetailsDefaults={getOrderDetailsDefaults}
            findProductByName={findProductByName}
            getNameProduct={getNameProduct}
            findProductByName={findProductByName}
            getSalesOrderDetails={getSalesOrderDetails}
            addSalesOrderDetail={addSalesOrderDetail}
            deleteSalesOrderDetail={deleteSalesOrderDetail}
            getSalesOrderDiscounts={getSalesOrderDiscounts}
            addSalesOrderDiscounts={addSalesOrderDiscounts}
            deleteSalesOrderDiscounts={deleteSalesOrderDiscounts}
            invoiceAllSaleOrder={invoiceAllSaleOrder}
            invoiceSelectionSaleOrder={invoiceSelectionSaleOrder}
            getSalesOrderRelations={getSalesOrderRelations}
            manufacturingOrderAllSaleOrder={manufacturingOrderAllSaleOrder}
            manufacturingOrderPartiallySaleOrder={manufacturingOrderPartiallySaleOrder}
            deliveryNoteAllSaleOrder={deliveryNoteAllSaleOrder}
            deliveryNotePartiallySaleOrder={deliveryNotePartiallySaleOrder}
        />,
        document.getElementById('renderTab'));
}

function getCustomerDefaults(customerId) {
    return getResourceDefaults("CUSTOMER", customerId);
}

function getSalesOrder() {
    return getRows("SALES_ORDER");
}

function addSalesOrder(salesOrder) {
    return addRows("SALES_ORDER", salesOrder);
}

function updateSalesOrder(salesOrder) {
    return updateRows("SALES_ORDER", salesOrder);
}

function deleteSalesOrder(salesOrderId) {
    return deleteRows("SALES_ORDER", salesOrderId);
}

function getSalesOrderDetails(orderId) {
    return getRows("SALES_ORDER_DETAIL", orderId);
}

function addSalesOrderDetail(detail) {
    return addRows("SALES_ORDER_DETAIL", detail);
}

function updateSalesOrderDetail(detail) {
    return updateRows("SALES_ORDER_DETAIL", detail);
}

function deleteSalesOrderDetail(detailId) {
    return deleteRows("SALES_ORDER_DETAIL", detailId);
}

function getOrderDetailsDefaults(productId) {
    return getResourceDefaults("SALES_ORDER_DETAIL", productId);
}

function findProductByName(productName) {
    return nameRecord("PRODUCT", productName);
}

function getNameProduct(productId) {
    return getRecordName("PRODUCT", productId);
}

function getSalesOrderDiscounts(orderId) {
    return getRows("SALES_ORDER_DISCOUNT", orderId);
}

function addSalesOrderDiscounts(discount) {
    return addRows("SALES_ORDER_DISCOUNT", discount);
}

function deleteSalesOrderDiscounts(discountId) {
    return deleteRows("SALES_ORDER_DISCOUNT", discountId);
}

function invoiceAllSaleOrder(orderId) {
    return executeAction("INVOICE_ALL_SALE_ORDER", orderId);
}

function invoiceSelectionSaleOrder(selection) {
    return executeAction("INVOICE_PARTIAL_SALE_ORDER", JSON.stringify(selection));
}

function deliveryNoteAllSaleOrder(orderId) {
    return executeAction("DELIVERY_NOTE_ALL_SALE_ORDER", orderId);
}

function deliveryNotePartiallySaleOrder(selection) {
    return executeAction("DELIVERY_NOTE_PARTIALLY_SALE_ORDER", JSON.stringify(selection));
}

function getSalesOrderRelations(orderId) {
    return executeAction("GET_SALES_ORDER_RELATIONS", orderId);
}

function manufacturingOrderAllSaleOrder(orderId) {
    return executeAction("MANUFACTURING_ORDER_ALL_SALE_ORDER", orderId);
}

function manufacturingOrderPartiallySaleOrder(orderInfo) {
    return executeAction("MANUFACTURING_ORDER_PARTIAL_SALE_ORDER", JSON.stringify(orderInfo));
}

/* SALES INVOICES */

function tabSalesInvoices() {
    ReactDOM.render(
        <SalesInvoices
            getSalesInvoices={getSalesInvoices}

            findCustomerByName={findCustomerByName}
            getCustomerName={getCustomerName}
            findPaymentMethodByName={findPaymentMethodByName}
            getNamePaymentMethod={getNamePaymentMethod}
            findCurrencyByName={findCurrencyByName}
            getNameCurrency={getNameCurrency}
            findBillingSerieByName={findBillingSerieByName}
            getNameBillingSerie={getNameBillingSerie}
            getCustomerDefaults={getCustomerDefaults}
            locateAddress={locateAddress}
            tabSalesInvoices={tabSalesInvoices}
            getNameAddress={getNameAddress}

            findProductByName={findProductByName}
            getOrderDetailsDefaults={getOrderDetailsDefaults}
            getSalesInvoiceDetails={getSalesInvoiceDetails}
            addSalesInvoiceDetail={addSalesInvoiceDetail}
            getNameProduct={getNameProduct}
            deleteSalesInvoiceDetail={deleteSalesInvoiceDetail}
            addSalesInvoice={addSalesInvoice}
            deleteSalesInvoice={deleteSalesInvoice}
            getSalesInvoiceRelations={getSalesInvoiceRelations}
        />,
        document.getElementById('renderTab'));
}

function getSalesInvoices() {
    return getRows("SALES_INVOICE");
}

function addSalesInvoice(invoice) {
    return addRows("SALES_INVOICE", invoice);
}

function deleteSalesInvoice(invoiceId) {
    return deleteRows("SALES_INVOICE", invoiceId);
}

function getSalesInvoiceDetails(invoiceId) {
    return getRows("SALES_INVOICE_DETAIL", invoiceId);
}

function addSalesInvoiceDetail(detail) {
    return addRows("SALES_INVOICE_DETAIL", detail);
}

function deleteSalesInvoiceDetail(detailId) {
    return deleteRows("SALES_INVOICE_DETAIL", detailId);
}

function getSalesInvoiceRelations(invoiceId) {
    return executeAction("GET_SALES_INVOICE_RELATIONS", invoiceId);
}

/* SALES DELIVERY NOTES */

function tabSalesDeliveryNotes() {
    ReactDOM.render(
        <SalesDeliveryNotes
            getSalesDeliveryNotes={getSalesDeliveryNotes}
            addSalesDeliveryNotes={addSalesDeliveryNotes}
            deleteSalesDeliveryNotes={deleteSalesDeliveryNotes}

            findCustomerByName={findCustomerByName}
            getCustomerName={getCustomerName}
            findPaymentMethodByName={findPaymentMethodByName}
            getNamePaymentMethod={getNamePaymentMethod}
            findCurrencyByName={findCurrencyByName}
            getNameCurrency={getNameCurrency}
            findBillingSerieByName={findBillingSerieByName}
            getNameBillingSerie={getNameBillingSerie}
            getCustomerDefaults={getCustomerDefaults}
            locateAddress={locateAddress}
            tabSalesDeliveryNotes={tabSalesDeliveryNotes}
            getNameAddress={getNameAddress}
            getSalesDeliveryNoteDetails={getSalesDeliveryNoteDetails}
            findProductByName={findProductByName}
            getNameProduct={getNameProduct}
            addWarehouseMovements={addWarehouseMovements}
            deleteWarehouseMovements={deleteWarehouseMovements}
        />,
        document.getElementById('renderTab'));
}

function getSalesDeliveryNotes() {
    return getRows("SALES_DELIVERY_NOTES");
}

function addSalesDeliveryNotes(detail) {
    return addRows("SALES_DELIVERY_NOTES", detail);
}

function deleteSalesDeliveryNotes(detailId) {
    return deleteRows("SALES_DELIVERY_NOTES", detailId);
}

function getSalesDeliveryNoteDetails(noteId) {
    return getRows("SALES_DELIVERY_NOTES_DETAILS", noteId);
}

/* CUSTOMERS */

function tabCustomers() {
    ReactDOM.render(
        <Customers
            getCustomers={getCustomers}
            addCustomer={addCustomer}
            updateCustomer={updateCustomer}
            deleteCustomer={deleteCustomer}
            tabCustomers={tabCustomers}

            getNameLanguage={getNameLanguage}
            getCountryName={getCountryName}
            getCityName={getCityName}
            getNamePaymentMethod={getNamePaymentMethod}
            getNameBillingSerie={getNameBillingSerie}

            findLanguagesByName={findLanguagesByName}
            findCountryByName={findCountryByName}
            findCityByName={findCityByName}
            findPaymentMethodByName={findPaymentMethodByName}
            findBillingSerieByName={findBillingSerieByName}

            locateAddress={locateAddress}
            getNameAddress={getNameAddress}
        />,
        document.getElementById('renderTab'));
}

function getCustomers() {
    return getRows("CUSTOMER");
}

function addCustomer(customer) {
    return addRows("CUSTOMER", customer);
}

function updateCustomer(customer) {
    return updateRows("CUSTOMER", customer);
}

function deleteCustomer(customerId) {
    return deleteRows("CUSTOMER", customerId);
}

function findPaymentMethodByName(paymentMethodName) {
    return nameRecord("PAYMENT_METHOD", paymentMethodName);
}

function findBillingSerieByName(billingSerieName) {
    return nameRecord("BILLING_SERIE", billingSerieName);
}

function getNamePaymentMethod(paymentMethodId) {
    return getRecordName("PAYMENT_METHOD", paymentMethodId);
}

function getNameBillingSerie(billingSerieId) {
    return getRecordName("BILLING_SERIE", billingSerieId);
}

function locateAddress(customerId) {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('LOCATE_ADDRESS$' + customerId);
    });
}

function getNameAddress(addressId) {
    return getRecordName("ADDRESS", addressId);
}

/* PRODUCTS */

function tabProducts() {
    ReactDOM.render(
        <Products
            getProducts={getProducts}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}

            findColorByName={findColorByName}
            getNameColor={getNameColor}
            findProductFamilyByName={findProductFamilyByName}
            getNameProductFamily={getNameProductFamily}
            tabProducts={tabProducts}
            getStock={getStock}
            getManufacturingOrderTypes={getManufacturingOrderTypes}
        />,
        document.getElementById('renderTab'));
}

function findColorByName(colorName) {
    return nameRecord("COLOR", colorName);
}

function getNameColor(colorId) {
    return getRecordName("COLOR", colorId);
}

function findProductFamilyByName(productFamilyName) {
    return nameRecord("PRODUCT_FAMILY", productFamilyName);
}

function getNameProductFamily(productFamilyId) {
    return getRecordName("PRODUCT_FAMILY", productFamilyId);
}

function getProducts() {
    return getRows("PRODUCT");
}

function addProduct(product) {
    return addRows("PRODUCT", product);
}

function updateProduct(product) {
    return updateRows("PRODUCT", product);
}

function deleteProduct(productId) {
    return deleteRows("PRODUCT", productId);
}

function getStock(productId) {
    return getRows("STOCK", productId);
}

/* COUNTRIES */

function tabCountries() {
    ReactDOM.render(
        <Countries
            getCountries={getCountries}
            addCountry={addCountry}
            updateCountry={updateCountry}
            deleteCountry={deleteCountry}
            findLanguagesByName={findLanguagesByName}
            findCurrencyByName={findCurrencyByName}
            getNameLanguage={getNameLanguage}
            getNameCurrency={getNameCurrency}
        />,
        document.getElementById('renderTab'));
}

function getCountries() {
    return getRows("COUNTRY");
}

function findLanguagesByName(languageName) {
    return nameRecord("LANGUAGE", languageName);
}

function findCurrencyByName(currencyName) {
    return nameRecord("CURRENCY", currencyName);
}

function getNameLanguage(languageId) {
    return getRecordName("LANGUAGE", languageId);
}

function getNameCurrency(currencyId) {
    return getRecordName("CURRENCY", currencyId);
}

function addCountry(country) {
    return addRows("COUNTRY", country);
}

function updateCountry(country) {
    return updateRows("COUNTRY", country);
}

function deleteCountry(countryId) {
    return deleteRows("COUNTRY", countryId);
}

/* CITIES */

function tabCities() {
    ReactDOM.render(
        <Cities
            findCountryByName={findCountryByName}
            getCountryName={getCountryName}
            getCities={getCities}
            addCity={addCity}
            updateCity={updateCity}
            deleteCity={deleteCity}
        />,
        document.getElementById('renderTab'));
}

function findCountryByName(countryName) {
    return nameRecord("COUNTRY", countryName);
}

function getCountryName(countryId) {
    return getRecordName("COUNTRY", countryId);
}

function getCities() {
    return getRows("CITY");
}

function addCity(city) {
    return addRows("CITY", city);
}

function updateCity(city) {
    return updateRows("CITY", city);
}

function deleteCity(cityId) {
    return deleteRows("CITY", cityId);
}

/* COLORS */

function tabColors() {
    ReactDOM.render(
        <Colors
            getColor={getColor}
            addColor={addColor}
            updateColor={updateColor}
            deleteColor={deleteColor}
        />,
        document.getElementById('renderTab'));
}

function getColor() {
    return getRows("COLOR");
}

function addColor(color) {
    return addRows("COLOR", color);
}

function updateColor(color) {
    return updateRows("COLOR", color);
}

function deleteColor(colorId) {
    return deleteRows("COLOR", colorId);
}

/* PRODUCT FAMILIES */

function tabProductFamilies() {
    ReactDOM.render(
        <ProductFamilies
            getProductFamilies={getProductFamilies}
            addProductFamilies={addProductFamilies}
            updateProductFamilies={updateProductFamilies}
            deleteProductFamilies={deleteProductFamilies}
        />,
        document.getElementById('renderTab'));
}

function getProductFamilies() {
    return getRows("PRODUCT_FAMILY");
}

function addProductFamilies(productFamily) {
    return addRows("PRODUCT_FAMILY", productFamily);
}

function updateProductFamilies(productFamily) {
    return updateRows("PRODUCT_FAMILY", productFamily);
}

function deleteProductFamilies(productFamilyId) {
    return deleteRows("PRODUCT_FAMILY", productFamilyId);
}

/* ADDRESSES */

function tabAddresses() {
    ReactDOM.render(
        <Addresses
            findCustomerByName={findCustomerByName}
            getCustomerName={getCustomerName}
            findCityByName={findCityByName}
            getCityName={getCityName}
            findCountryByName={findCountryByName}
            getCountryName={getCountryName}

            getAddresses={getAddresses}
            addAddress={addAddress}
            updateAddress={updateAddress}
            deleteAddress={deleteAddress}
        />,
        document.getElementById('renderTab'));
}

function findCustomerByName(customerName) {
    return nameRecord("CUSTOMER", customerName);
}

function getCustomerName(customerId) {
    return getRecordName("CUSTOMER", customerId);
}

function findCityByName(countryId, cityName) {
    return nameRecord("CITY", JSON.stringify({ countryId, cityName }));
}

function getCityName(cityId) {
    return getRecordName("CITY", cityId);
}

function getAddresses() {
    return getRows("ADDRESS$");
}

function addAddress(address) {
    return addRows("ADDRESS", address);
}

function updateAddress(address) {
    return updateRows("ADDRESS", address);
}

function deleteAddress(addressId) {
    return deleteRows("ADDRESS", addressId);
}

/* BILLING SERIES */

function tabBillingSeries() {
    ReactDOM.render(
        <BillingSeries
            getBillingSeries={getBillingSeries}
            addBillingSerie={addBillingSerie}
            updateBillingSerie={updateBillingSerie}
            deleteBillingSerie={deleteBillingSerie}
        />,
        document.getElementById('renderTab'));
}

function getBillingSeries() {
    return getRows("BILLING_SERIE");
}

function addBillingSerie(billingSerie) {
    return addRows("BILLING_SERIE", billingSerie);
}

function updateBillingSerie(billingSerie) {
    return updateRows("BILLING_SERIE", billingSerie);
}

function deleteBillingSerie(billingSerieId) {
    return deleteRows("BILLING_SERIE", billingSerieId);
}

/* CURRENCIES */

function tabCurrencies() {
    ReactDOM.render(
        <Currencies
            getCurrencies={getCurrencies}
            addCurrency={addCurrency}
            updateCurrency={updateCurrency}
            deleteCurrency={deleteCurrency}
        />,
        document.getElementById('renderTab'));
}

function getCurrencies() {
    return getRows("CURRENCY");
}

function addCurrency(currency) {
    return addRows("CURRENCY", currency);
}

function updateCurrency(currency) {
    return updateRows("CURRENCY", currency);
}

function deleteCurrency(currencyId) {
    return deleteRows("CURRENCY", currencyId);
}

/* PAYMENT METHOD */

function tabPaymentMethod() {
    ReactDOM.render(
        <PaymentMethods
            getPaymentMethod={getPaymentMethod}
            addPaymentMehod={addPaymentMehod}
            updatePaymentMethod={updatePaymentMethod}
            deletePaymentMethod={deletePaymentMethod}
        />,
        document.getElementById('renderTab'));
}

function getPaymentMethod() {
    return getRows("PAYMENT_METHOD");
}

function addPaymentMehod(paymentMethod) {
    return addRows("PAYMENT_METHOD", paymentMethod);
}

function updatePaymentMethod(paymentMethod) {
    return updateRows("PAYMENT_METHOD", paymentMethod);
}

function deletePaymentMethod(paymentMethodId) {
    return deleteRows("PAYMENT_METHOD", paymentMethodId);
}

/* LANGUAGES */

function tabLanguages() {
    ReactDOM.render(
        <Languages
            getLanguages={getLanguages}
            addLanguages={addLanguages}
            updateLanguages={updateLanguages}
            deleteLanguages={deleteLanguages}
        />,
        document.getElementById('renderTab'));
}

function getLanguages() {
    return getRows("LANGUAGE");
}

function addLanguages(language) {
    return addRows("LANGUAGE", language);
}

function updateLanguages(language) {
    return updateRows("LANGUAGE", language);
}

function deleteLanguages(languageId) {
    return deleteRows("LANGUAGE", languageId);
}

/* PACKAGES */

function tabPackages() {
    ReactDOM.render(
        <Packages
            getPackages={getPackages}
            addPackages={addPackages}
            updatePackages={updatePackages}
            deletePackages={deletePackages}
        />,
        document.getElementById('renderTab'));
}

function getPackages() {
    return getRows("PACKAGES");
}

function addPackages(_package) {
    return addRows("PACKAGES", _package);
}

function updatePackages(_package) {
    return updateRows("PACKAGES", _package);
}

function deletePackages(packageId) {
    return deleteRows("PACKAGES", packageId);
}

/* WAREHOUSES */

function tabWarehouses() {
    ReactDOM.render(
        <Warehouses
            getWarehouses={getWarehouses}
            addWarehouses={addWarehouses}
            updateWarehouses={updateWarehouses}
            deleteWarehouses={deleteWarehouses}
            getWarehouseMovementsByWarehouse={getWarehouseMovementsByWarehouse}
            getNameProduct={getNameProduct}
            tabWarehouses={tabWarehouses}
        />,
        document.getElementById('renderTab'));
}

function getWarehouses() {
    return getRows("WAREHOUSE");
}

function addWarehouses(warehouse) {
    return addRows("WAREHOUSE", warehouse);
}

function updateWarehouses(warehouse) {
    return updateRows("WAREHOUSE", warehouse);
}

function deleteWarehouses(warehouseId) {
    return deleteRows("WAREHOUSE", warehouseId);
}

function findWarehouseByName(searchName) {
    return nameRecord("WAREHOUSE", searchName);
}

function getNameWarehouse(warehouseId) {
    return getRecordName("WAREHOUSE", warehouseId);
}

function getWarehouseMovementsByWarehouse(warehouseId) {
    return getRows("WAREHOUSE_WAREHOUSE_MOVEMENTS", warehouseId);
}

/* WAREHOUSE MOVEMENTS */

function tabWarehouseMovements() {
    ReactDOM.render(
        <WarehouseMovements
            getWarehouseMovements={getWarehouseMovements}
            addWarehouseMovements={addWarehouseMovements}
            deleteWarehouseMovements={deleteWarehouseMovements}
            findProductByName={findProductByName}
            getNameProduct={getNameProduct}
            findWarehouseByName={findWarehouseByName}
            getNameWarehouse={getNameWarehouse}
            getWarehouses={getWarehouses}
        />,
        document.getElementById('renderTab'));
}

function getWarehouseMovements() {
    return getRows("WAREHOUSE_MOVEMENTS");
}

function addWarehouseMovements(movement) {
    return addRows("WAREHOUSE_MOVEMENTS", movement);
}

function deleteWarehouseMovements(movementId) {
    return deleteRows("WAREHOUSE_MOVEMENTS", movementId);
}

/* MANUFACTURING ORDERS */

function tabManufacturingOrders() {
    ReactDOM.render(
        <ManufacturingOrders
            getManufacturingOrderTypes={getManufacturingOrderTypes}
            getManufacturingOrders={getManufacturingOrders}
            addManufacturingOrder={addManufacturingOrder}
            updateManufacturingOrder={updateManufacturingOrder}
            deleteManufacturingOrder={deleteManufacturingOrder}
            findProductByName={findProductByName}
            getNameProduct={getNameProduct}
            toggleManufactuedManufacturingOrder={toggleManufactuedManufacturingOrder}
        />,
        document.getElementById('renderTab'));
}

function getManufacturingOrders(orderTypeId) {
    return getRows("MANUFACTURING_ORDER", orderTypeId);
}

function addManufacturingOrder(order) {
    return addRows("MANUFACTURING_ORDER", order);
}

function updateManufacturingOrder(order) {
    return updateRows("MANUFACTURING_ORDER", order);
}

function deleteManufacturingOrder(orderId) {
    return deleteRows("MANUFACTURING_ORDER", orderId);
}

function toggleManufactuedManufacturingOrder(orderId) {
    return executeAction("TOGGLE_MANUFACTURING_ORDER", orderId);
}

/* MANUFACTURING ORDER TYPES */

function tabManufacturingOrderTypes() {
    ReactDOM.render(
        <ManufacturingOrderTypes
            getManufacturingOrderTypes={getManufacturingOrderTypes}
            addManufacturingOrderTypes={addManufacturingOrderTypes}
            updateManufacturingOrderTypes={updateManufacturingOrderTypes}
            deleteManufacturingOrderTypes={deleteManufacturingOrderTypes}
        />,
        document.getElementById('renderTab'));
}

function getManufacturingOrderTypes() {
    return getRows("MANUFACTURING_ORDER_TYPE");
}

function addManufacturingOrderTypes(type) {
    return addRows("MANUFACTURING_ORDER_TYPE", type);
}

function updateManufacturingOrderTypes(type) {
    return updateRows("MANUFACTURING_ORDER_TYPE", type);
}

function deleteManufacturingOrderTypes(typeId) {
    return deleteRows("MANUFACTURING_ORDER_TYPE", typeId);
}

/* PACKAGING */

function tabPackaging() {
    ReactDOM.render(
        <PackagingMenu
            getSalesOrderPreparation={getSalesOrderPreparation}
            getSalesOrderAwaitingShipping={getSalesOrderAwaitingShipping}
            getCustomerName={getCustomerName}
            getSalesOrderDetails={getSalesOrderDetails}
            getNameProduct={getNameProduct}
            getPackages={getPackages}
            getSalesOrderPackaging={getSalesOrderPackaging}
            addSalesOrderPackaging={addSalesOrderPackaging}
            addSalesOrderDetailPackaged={addSalesOrderDetailPackaged}
            deleteSalesOrderDetailPackaged={deleteSalesOrderDetailPackaged}
            deletePackaging={deletePackaging}
            tabPackaging={tabPackaging}
        />,
        document.getElementById('renderTab'));
}

function getSalesOrderPreparation() {
    return getRows("SALES_ORDER_PREPARATION");
}

function getSalesOrderAwaitingShipping() {
    return getRows("SALES_ORDER_AWAITING_SHIPPING");
}

function getSalesOrderPackaging(saleOrderId) {
    return getRows("SALES_ORDER_PACKAGING", saleOrderId);
}

function addSalesOrderPackaging(_package) {
    return addRows("SALES_ORDER_PACKAGING", _package);
}

function addSalesOrderDetailPackaged(packaged) {
    return addRows("SALES_ORDER_DETAIL_PACKAGED", packaged);
}

function deleteSalesOrderDetailPackaged(packaged) {
    return executeAction("DELETE_SALES_ORDER_DETAIL_PACKAGED", JSON.stringify(packaged));
}

function deletePackaging(packagingId) {
    return deleteRows("PACKAGING", packagingId);
}



main();
