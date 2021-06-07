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
import Incoterms from './COMPONENTS/Masters/Incoterms/Incoterms.js';
import WarehouseMovements from './COMPONENTS/Warehouse/WarehouseMovements/WarehouseMovements.js';
import SalesDeliveryNotes from './COMPONENTS/Sales/DeliveryNotes/SalesDeliveryNotes.js';
import Shippings from './COMPONENTS/Preparation/Shipping/Shippings.js';
import Carriers from './COMPONENTS/Masters/Carriers/Carriers.js';
import Users from './COMPONENTS/Utils/Users/Users.js';
import Groups from './COMPONENTS/Utils/Groups/Groups.js';
import Login from './COMPONENTS/Login.js';
import Suppliers from './COMPONENTS/Masters/Suppliers/Suppliers.js';
import PurchaseOrders from './COMPONENTS/Purchases/Orders/PurchaseOrders.js';
import Needs from './COMPONENTS/Purchases/Needs/Needs.js';
import PurchaseDeliveryNotes from './COMPONENTS/Purchases/DeliveryNotes/PurchaseDeliveryNotes.js';
import PurchaseInvoices from './COMPONENTS/Purchases/Invoice/PurchaseInvoices.js';
import ErrorScreen from './COMPONENTS/ErrorScreen.js';
import Settings from './COMPONENTS/Utils/Settings/Settings.js';
import DocumentContainers from './COMPONENTS/Masters/DocumentContainers/DocumentContainers.js';
import Documents from './COMPONENTS/Masters/Documents/Documents.js';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

var ws;
var config;

function main() {
    ws = new WebSocket('ws://' + window.location.hostname + ':12279/')
    console.log(ws);
    ws.onopen = () => {
        // attempt login via token
        loginToken().then((ok) => {
            if (ok) {
                renderMenu();
                getSettings().then((conf) => {
                    config = conf;
                });
            } else {
                ReactDOM.render(
                    <Login
                        login={login}
                        handleMenu={() => {
                            renderMenu();
                            getSettings().then((conf) => {
                                config = conf;
                            });
                        }}
                    />,
                    document.getElementById('root'));
            }
        });
    }
    ws.onclose = (err) => {
        console.log(err)
        ReactDOM.render(
            <ErrorScreen
                errorTitle={"CONNECTION WITH THE SERVER HAS BEEN LOST"}
                errorDescription={"Please, check you Internet connection, try to refresh the page, reboot your device"
                    + ", or, if neither of that options work, contact support."}
            />, document.getElementById('root'));
    }
}

function loginToken() {
    const token = getCookie("token");
    if (token !== undefined && token.length > 0) {
        return new Promise((resolve) => {
            ws.onmessage = (msg) => {
                resolve(JSON.parse(msg.data).ok);
            }
            ws.send(JSON.stringify({ token: token }));
        });
    } else {
        return new Promise((resolve) => {
            resolve(false);
        });
    }
}

function getCookie(key) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const data = cookies[i].split("=");
        if (data[0] === key) {
            return data[1];
        }
    }
}

function login(loginData) {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send(JSON.stringify(loginData));
    });
}

function renderMenu() {
    ReactDOM.render(
        <Menu
            handleSalesOrders={tabSalesOrders}
            handleSalesInvoices={tabSalesInvoices}
            handleSalesDeliveryNotes={tabSalesDeliveryNotes}
            handlePurchaseOrders={tabPurchaseOrders}
            handlePurchaseInvoices={tabPurcaseInvoices}
            handlePurchaseDeliveryNotes={tabPurchaseDeliveryNotes}
            handleNeeds={tabNeeds}
            handleCustomers={tabCustomers}
            handleSuppliers={tabSuppliers}
            handleProducts={tabProducts}
            handleCountries={tabCountries}
            handleCities={tabCities}
            handleColors={tabColors}
            handleProductFamilies={tabProductFamilies}
            handleAddresses={tabAddresses}
            handleCarriers={tabCarriers}
            handleBillingSeries={tabBillingSeries}
            handleCurrencies={tabCurrencies}
            handlePaymentMethod={tabPaymentMethod}
            handleLanguage={tabLanguages}
            handlePackages={tabPackages}
            handleIncoterms={tabIncoterms}
            handleDocuments={tabDocuments}
            handleDocumentContainers={tabDocumentContainers}
            handleWarehouse={tabWarehouses}
            handleWarehouseMovements={tabWarehouseMovements}
            handleManufacturingOrders={tabManufacturingOrders}
            handleManufacturingOrderTypes={tabManufacturingOrderTypes}
            handlePackaging={tabPackaging}
            handleShipping={tabShipping}
            handleSettings={tabSettings}
            handleUsers={tabUsers}
            handleGroups={tabGroups}
        />,
        document.getElementById('root'));
}

window.dateFormat = (date) => {
    return dateFormat(date, config.dateFormat);//"yyyy-mm-dd hh:MM:ss"
}

window.bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
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

function locateRows(resource, extraData = "") {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('LOCATE:' + resource + '$' + extraData);
    });
}

function searchRows(resource, search) {
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            resolve(JSON.parse(msg.data));
        }
        ws.send('SEARCH:' + resource + '$' + search);
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
            locateAddress={locateAddressByCustomer}
            tabSalesOrders={tabSalesOrders}
            getSalesOrder={getSalesOrder}
            searchSalesOrder={searchSalesOrder}
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
            updateSalesOrderDetail={updateSalesOrderDetail}
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
            findCarrierByName={findCarrierByName}
            getNameCarrier={getNameCarrier}
            findWarehouseByName={findWarehouseByName}
            getNameWarehouse={getNameWarehouse}
            salesOrderDefaults={salesOrderDefaults}
            documentFunctions={getDocumenetFunctions()}
        />,
        document.getElementById('renderTab'));
}

function getCustomerDefaults(customerId) {
    return getResourceDefaults("CUSTOMER", customerId);
}

function getSalesOrder() {
    return getRows("SALES_ORDER");
}

function searchSalesOrder(search) {
    return searchRows("SALES_ORDER", JSON.stringify(search));
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

function findCarrierByName(carrier) {
    return nameRecord("CARRIER", carrier);
}

function getNameCarrier(carrierId) {
    return getRecordName("CARRIER", carrierId);
}

function salesOrderDefaults() {
    return getResourceDefaults("SALES_ORDER");
}

/* SALES INVOICES */

function tabSalesInvoices() {
    ReactDOM.render(
        <SalesInvoices
            getSalesInvoices={getSalesInvoices}
            searchSalesInvoices={searchSalesInvoices}

            findCustomerByName={findCustomerByName}
            getCustomerName={getCustomerName}
            findPaymentMethodByName={findPaymentMethodByName}
            getNamePaymentMethod={getNamePaymentMethod}
            findCurrencyByName={findCurrencyByName}
            getNameCurrency={getNameCurrency}
            findBillingSerieByName={findBillingSerieByName}
            getNameBillingSerie={getNameBillingSerie}
            getCustomerDefaults={getCustomerDefaults}
            locateAddress={locateAddressByCustomer}
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
            documentFunctions={getDocumenetFunctions()}
        />,
        document.getElementById('renderTab'));
}

function getSalesInvoices() {
    return getRows("SALES_INVOICE");
}

function searchSalesInvoices(search) {
    return searchRows("SALES_INVOICE", JSON.stringify(search));
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
            searchSalesDeliveryNotes={searchSalesDeliveryNotes}
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
            locateAddress={locateAddressByCustomer}
            tabSalesDeliveryNotes={tabSalesDeliveryNotes}
            getNameAddress={getNameAddress}
            getSalesDeliveryNoteDetails={getSalesDeliveryNoteDetails}
            findProductByName={findProductByName}
            getNameProduct={getNameProduct}
            addWarehouseMovements={addWarehouseMovements}
            deleteWarehouseMovements={deleteWarehouseMovements}
            getSalesDeliveryNotesRelations={getSalesDeliveryNotesRelations}
            findWarehouseByName={findWarehouseByName}
            getNameWarehouse={getNameWarehouse}
            documentFunctions={getDocumenetFunctions()}
        />,
        document.getElementById('renderTab'));
}

function getSalesDeliveryNotes() {
    return getRows("SALES_DELIVERY_NOTES");
}

function searchSalesDeliveryNotes(search) {
    return searchRows("SALES_DELIVERY_NOTE", JSON.stringify(search));
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

function getSalesDeliveryNotesRelations(noteId) {
    return executeAction("GET_SALES_DELIVERY_NOTE_RELATIONS", noteId);
}

/* PURCHASE ORDERS */

function tabPurchaseOrders() {
    ReactDOM.render(
        <PurchaseOrders
            findSupplierByName={findSupplierByName}
            getSupplierName={getSupplierName}
            findPaymentMethodByName={findPaymentMethodByName}
            getNamePaymentMethod={getNamePaymentMethod}
            findCurrencyByName={findCurrencyByName}
            getNameCurrency={getNameCurrency}
            findBillingSerieByName={findBillingSerieByName}
            getNameBillingSerie={getNameBillingSerie}
            getSupplierDefaults={getSupplierDefaults}
            locateAddress={locateAddressBySupplier}
            tabPurchaseOrders={tabPurchaseOrders}
            getPurchaseOrder={getPurchaseOrder}
            searchPurchaseOrder={searchPurchaseOrder}
            addPurchaseOrder={addPurchaseOrder}
            updatePurchaseOrder={updatePurchaseOrder}
            deletePurchaseOrder={deletePurchaseOrder}
            getNameAddress={getNameAddress}
            getOrderDetailsDefaults={getOrderDetailsDefaults}
            findProductByName={findProductByName}
            getNameProduct={getNameProduct}
            findProductByName={findProductByName}
            getPurchaseOrderDetails={getPurchaseOrderDetails}
            addPurchaseOrderDetail={addPurchaseOrderDetail}
            updatePurchaseOrderDetail={updatePurchaseOrderDetail}
            deletePurchaseOrderDetail={deletePurchaseOrderDetail}
            getSalesOrderDiscounts={getSalesOrderDiscounts}
            addSalesOrderDiscounts={addSalesOrderDiscounts}
            deleteSalesOrderDiscounts={deleteSalesOrderDiscounts}
            invoiceAllPurchaseOrder={invoiceAllPurchaseOrder}
            invoicePartiallyPurchaseOrder={invoicePartiallyPurchaseOrder}
            getPurchaseOrderRelations={getPurchaseOrderRelations}
            deliveryNoteAllPurchaseOrder={deliveryNoteAllPurchaseOrder}
            deliveryNotePartiallyPurchaseOrder={deliveryNotePartiallyPurchaseOrder}
            findCarrierByName={findCarrierByName}
            getNameCarrier={getNameCarrier}
            findWarehouseByName={findWarehouseByName}
            getNameWarehouse={getNameWarehouse}
            getPurchaseOrderDefaults={getPurchaseOrderDefaults}
            documentFunctions={getDocumenetFunctions()}
        />,
        document.getElementById('renderTab'));
}

function getPurchaseOrder() {
    return getRows("PURCHASE_ORDER");
}

function searchPurchaseOrder(search) {
    return searchRows("PURCHASE_ORDER", JSON.stringify(search));
}

function addPurchaseOrder(order) {
    return addRows("PURCHASE_ORDER", order);
}

function updatePurchaseOrder(order) {
    return updateRows("PURCHASE_ORDER", order);
}

function deletePurchaseOrder(orderId) {
    return deleteRows("PURCHASE_ORDER", orderId);
}

function getSupplierDefaults(supplierId) {
    return getResourceDefaults("SUPPLIER", supplierId);
}

function getPurchaseOrderDefaults() {
    return getResourceDefaults("PURCHASE_ORDER");
}

function getPurchaseOrderDetails(orderId) {
    return getRows("PURCHASE_ORDER_DETAIL", orderId);
}

function addPurchaseOrderDetail(detail) {
    return addRows("PURCHASE_ORDER_DETAIL", detail);
}

function updatePurchaseOrderDetail(detail) {
    return updateRows("PURCHASE_ORDER_DETAIL", detail);
}

function deletePurchaseOrderDetail(detailId) {
    return deleteRows("PURCHASE_ORDER_DETAIL", detailId);
}

function locateAddressBySupplier(supplierId) {
    return locateRows("ADDRESS_SUPPLIER", supplierId);
}

function invoiceAllPurchaseOrder(orderId) {
    return executeAction("INVOICE_ALL_PURCHASE_ORDER", orderId);
}

function invoicePartiallyPurchaseOrder(details) {
    return executeAction("INVOICE_PARTIAL_PURCHASE_ORDER", JSON.stringify(details));
}

function deliveryNoteAllPurchaseOrder(orderId) {
    return executeAction("DELIVERY_NOTE_ALL_PURCHASE_ORDER", orderId);
}

function deliveryNotePartiallyPurchaseOrder(details) {
    return executeAction("DELIVERY_NOTE_PARTIALLY_PURCHASE_ORDER", JSON.stringify(details));
}

function getPurchaseOrderRelations(orderId) {
    return executeAction("GET_PURCHASE_ORDER_RELATIONS", orderId);
}

/* PURCHASE INVOICES */

function tabPurcaseInvoices() {
    ReactDOM.render(
        <PurchaseInvoices
            getPurchaseInvoices={getPurchaseInvoices}
            searchPurchaseInvoices={searchPurchaseInvoices}

            findSupplierByName={findSupplierByName}
            getSupplierName={getSupplierName}
            findPaymentMethodByName={findPaymentMethodByName}
            getNamePaymentMethod={getNamePaymentMethod}
            findCurrencyByName={findCurrencyByName}
            getNameCurrency={getNameCurrency}
            findBillingSerieByName={findBillingSerieByName}
            getNameBillingSerie={getNameBillingSerie}
            getSupplierDefaults={getSupplierDefaults}
            locateAddress={locateAddressByCustomer}
            tabPurcaseInvoices={tabPurcaseInvoices}
            getNameAddress={getNameAddress}

            findProductByName={findProductByName}
            getOrderDetailsDefaults={getOrderDetailsDefaults}
            getPurchaseInvoiceDetails={getPurchaseInvoiceDetails}
            addPurchaseInvoiceDetail={addPurchaseInvoiceDetail}
            getNameProduct={getNameProduct}
            deletePurchaseInvoiceDetail={deletePurchaseInvoiceDetail}
            addPurchaseInvoice={addPurchaseInvoice}
            deletePurchaseInvoice={deletePurchaseInvoice}
            getPurchaseInvoiceRelations={getPurchaseInvoiceRelations}
            documentFunctions={getDocumenetFunctions()}
        />,
        document.getElementById('renderTab'));
}

function getPurchaseInvoices() {
    return getRows("PURCHASE_INVOICES");
}

function searchPurchaseInvoices(search) {
    return searchRows("PURCHASE_INVOICE", JSON.stringify(search));
}

function addPurchaseInvoice(invoice) {
    return addRows("PURCHASE_INVOICE", invoice);
}

function deletePurchaseInvoice(invoiceId) {
    return deleteRows("PURCHASE_INVOICE", invoiceId);
}

function getPurchaseInvoiceDetails(invoiceId) {
    return getRows("PURCHASE_INVOICE_DETAIL", invoiceId);
}

function addPurchaseInvoiceDetail(detail) {
    return addRows("PURCHASE_INVOICE_DETAIL", detail);
}

function deletePurchaseInvoiceDetail(detailId) {
    return deleteRows("PURCHASE_INVOICE_DETAIL", detailId);
}

function getPurchaseInvoiceRelations(invoiceId) {
    return executeAction("GET_INVOICE_ORDER_RELATIONS", invoiceId);
}

/* PURCHASE DELIVERY NOTES */

function tabPurchaseDeliveryNotes() {
    ReactDOM.render(
        <PurchaseDeliveryNotes
            getPurchaseDeliveryNotes={getPurchaseDeliveryNotes}
            searchPurchaseDeliveryNotes={searchPurchaseDeliveryNotes}
            addPurchaseDeliveryNotes={addPurchaseDeliveryNotes}
            deletePurchaseDeliveryNotes={deletePurchaseDeliveryNotes}

            findSupplierByName={findSupplierByName}
            getSupplierName={getSupplierName}
            findPaymentMethodByName={findPaymentMethodByName}
            getNamePaymentMethod={getNamePaymentMethod}
            findCurrencyByName={findCurrencyByName}
            getNameCurrency={getNameCurrency}
            findBillingSerieByName={findBillingSerieByName}
            getNameBillingSerie={getNameBillingSerie}
            getSupplierDefaults={getSupplierDefaults}
            locateAddress={locateAddressByCustomer}
            tabPurchaseDeliveryNotes={tabPurchaseDeliveryNotes}
            getNameAddress={getNameAddress}
            getPurchaseDeliveryNoteDetails={getPurchaseDeliveryNoteDetails}
            findProductByName={findProductByName}
            getNameProduct={getNameProduct}
            addWarehouseMovements={addWarehouseMovements}
            deleteWarehouseMovements={deleteWarehouseMovements}
            getPurchaseDeliveryNotesRelations={getPurchaseDeliveryNotesRelations}
            findWarehouseByName={findWarehouseByName}
            getNameWarehouse={getNameWarehouse}
            documentFunctions={getDocumenetFunctions()}
        />,
        document.getElementById('renderTab'));
}

function getPurchaseDeliveryNotes() {
    return getRows("PURCHASE_DELIVERY_NOTES");
}

function searchPurchaseDeliveryNotes(search) {
    return searchRows("PURCHASE_DELIVERY_NOTE", JSON.stringify(search));
}

function addPurchaseDeliveryNotes(detail) {
    return addRows("PURCHASE_DELIVERY_NOTE", detail);
}

function deletePurchaseDeliveryNotes(detailId) {
    return deleteRows("PURCHASE_DELIVERY_NOTE", detailId);
}

function getPurchaseDeliveryNoteDetails(noteId) {
    return getRows("PURCHASE_DELIVERY_NOTES_DETAILS", noteId);
}

function getPurchaseDeliveryNotesRelations(noteId) {
    return executeAction("GET_PURCHASE_DELIVERY_NOTE_RELATIONS", noteId);
}

/* CUSTOMERS */

function tabCustomers() {
    ReactDOM.render(
        <Customers
            getCustomers={getCustomers}
            searchCustomers={searchCustomers}
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

            locateAddress={locateAddressByCustomer}
            getNameAddress={getNameAddress}
        />,
        document.getElementById('renderTab'));
}

function getCustomers() {
    return getRows("CUSTOMER");
}

function searchCustomers(search) {
    return searchRows("CUSTOMER", search);
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

function locateAddressByCustomer(customerId) {
    return locateRows("ADDRESS_CUSTOMER", customerId);
}

function getNameAddress(addressId) {
    return getRecordName("ADDRESS", addressId);
}

/* SUPPLIERS */

function tabSuppliers() {
    ReactDOM.render(
        <Suppliers
            getSuppliers={getSuppliers}
            searchSuppliers={searchSuppliers}
            addSupplier={addSupplier}
            updateSupplier={updateSupplier}
            deleteSupplier={deleteSupplier}
            tabSuppliers={tabSuppliers}

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

            locateAddress={locateAddressBySupplier}
            getNameAddress={getNameAddress}
        />,
        document.getElementById('renderTab'));
}

function getSuppliers() {
    return getRows("SUPPLIERS");
}

function searchSuppliers(search) {
    return searchRows("SUPPLER", search);
}

function addSupplier(supplier) {
    return addRows("SUPPLIER", supplier);
}

function updateSupplier(supplier) {
    return updateRows("SUPPLIER", supplier);
}

function deleteSupplier(supplierId) {
    return deleteRows("SUPPLIER", supplierId);
}

/* NEEDS */

function tabNeeds() {
    ReactDOM.render(
        <Needs
            getNeeds={getNeeds}
            purchaseNeeds={purchaseNeeds}
        />,
        document.getElementById('renderTab'));
}

function getNeeds() {
    return getRows("NEEDS");
}

function purchaseNeeds(needs) {
    return executeAction("PURCHASE_NEEDS", JSON.stringify(needs));
}

/* PRODUCTS */

function tabProducts() {
    ReactDOM.render(
        <Products
            getProducts={getProducts}
            searchProducts={searchProducts}
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
            findSupplierByName={findSupplierByName}
            getSupplierName={getSupplierName}
            getProductSalesOrderPending={getProductSalesOrderPending}
            getProductPurchaseOrderPending={getProductPurchaseOrderPending}
            getProductSalesOrder={getProductSalesOrder}
            getProductPurchaseOrder={getProductPurchaseOrder}
            getProductWarehouseMovements={getProductWarehouseMovements}
            getNameProduct={getNameProduct}
            getWarehouses={getWarehouses}
            productGenerateBarcode={productGenerateBarcode}
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

function searchProducts(search) {
    return searchRows("PRODUCT", search);
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

function getProductSalesOrderPending(productId) {
    return getRows("PRODUCT_SALES_ORDER_PENDING", productId);
}

function getProductPurchaseOrderPending(productId) {
    return getRows("PRODUCT_PURCHASE_ORDER_PENDING", productId);
}

function getProductSalesOrder(productId) {
    return getRows("PRODUCT_SALES_ORDER", productId);
}

function getProductPurchaseOrder(productId) {
    return getRows("PRODUCT_PURCHASE_ORDER", productId);
}

function getProductWarehouseMovements(productId) {
    return getRows("PRODUCT_WAREHOUSE_MOVEMENT", productId);
}

function productGenerateBarcode(productId) {
    return executeAction("PRODUCT_EAN13", productId);
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
            findSupplierByName={findSupplierByName}
            getSupplierName={getSupplierName}

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

function findSupplierByName(supplierName) {
    return nameRecord("SUPPLIER", supplierName);
}

function getSupplierName(supplierId) {
    return getRecordName("SUPPLIER", supplierId);
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

/* CARRIERS */

function tabCarriers() {
    ReactDOM.render(
        <Carriers
            getCarriers={getCarriers}
            addCarrier={addCarrier}
            updateCarrier={updateCarrier}
            deleteCarrier={deleteCarrier}
        />,
        document.getElementById('renderTab'));
}

function getCarriers() {
    return getRows("CARRIERS");
}

function addCarrier(carrier) {
    return addRows("CARRIER", carrier);
}

function updateCarrier(carrier) {
    return updateRows("CARRIER", carrier);
}

function deleteCarrier(carrierId) {
    return deleteRows("CARRIER", carrierId);
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

/* INCOTERMS */

function tabIncoterms() {
    ReactDOM.render(
        <Incoterms
            getIncoterms={getIncoterms}
            addIncoterms={addIncoterms}
            updateIncoterms={updateIncoterms}
            deleteIncoterms={deleteIncoterms}
        />,
        document.getElementById('renderTab'));
}

function getIncoterms() {
    return getRows("INCOTERMS");
}

function addIncoterms(incoterm) {
    return addRows("INCOTERM", incoterm);
}

function updateIncoterms(incoterm) {
    return updateRows("INCOTERM", incoterm);
}

function deleteIncoterms(incotermId) {
    return deleteRows("INCOTERM", incotermId);
}

/* DOCUMENT CONTAINERS */

function tabDocumentContainers() {
    ReactDOM.render(
        <DocumentContainers
            getDocumentContainers={getDocumentContainers}
            addDocumentContainers={addDocumentContainers}
            updateDocumentContainers={updateDocumentContainers}
            deleteDocumentContainers={deleteDocumentContainers}
        />,
        document.getElementById('renderTab'));
}

function getDocumentContainers() {
    return getRows("DOCUMENT_CONTAINER");
}

function addDocumentContainers(container) {
    return addRows("DOCUMENT_CONTAINER", container);
}

function updateDocumentContainers(container) {
    return updateRows("DOCUMENT_CONTAINER", container);
}

function deleteDocumentContainers(containerId) {
    return deleteRows("DOCUMENT_CONTAINER", containerId);
}

function locateDocumentContainers() {
    return locateRows("DOCUMENT_CONTAINER");
}

/* DOCUMENTS */

function tabDocuments() {
    ReactDOM.render(
        <Documents
            getDocuments={getDocuments}
            addDocuments={addDocuments}
            deleteDocuments={deleteDocuments}
            uploadDocument={uploadDocument}
            grantDocumentAccessToken={grantDocumentAccessToken}
            locateDocumentContainers={locateDocumentContainers}
        />,
        document.getElementById('renderTab'));
}

function getDocuments(extraData = "") {
    return getRows("DOCUMENTS", extraData);
}

function addDocuments(documents) {
    return executeAction("INSERT_DOCUMENT", JSON.stringify(documents));
}

function uploadDocument(uuid, token, file) {
    let formData = new FormData();
    formData.append("file", file);
    return fetch("http://" + window.location.hostname + ":12279/document?uuid=" + uuid + "&token=" + token, { method: "POST", body: file });
}

function grantDocumentAccessToken() {
    return executeAction("GRANT_DOCUMENT_ACCESS_TOKEN");
}

function deleteDocuments(documentsId) {
    return deleteRows("DOCUMENT", documentsId);
}

function getDocumenetFunctions() {
    return {
        getDocuments, addDocuments, deleteDocuments, uploadDocument, grantDocumentAccessToken, locateDocumentContainers
    };
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
            getProductRow={getProductRow}
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

function getProductRow(productId) {
    return executeAction("GET_PRODUCT_ROW", productId);
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
            addSalesOrderDetailPackagedEan13={addSalesOrderDetailPackagedEan13}
            deleteSalesOrderDetailPackaged={deleteSalesOrderDetailPackaged}
            deletePackaging={deletePackaging}
            tabPackaging={tabPackaging}
            generateShipping={generateShipping}
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

function addSalesOrderDetailPackagedEan13(packaged) {
    return addRows("SALES_ORDER_DETAIL_PACKAGED_EAN13", packaged);
}

function deleteSalesOrderDetailPackaged(packaged) {
    return executeAction("DELETE_SALES_ORDER_DETAIL_PACKAGED", JSON.stringify(packaged));
}

function deletePackaging(packagingId) {
    return deleteRows("PACKAGING", packagingId);
}

function generateShipping(orderId) {
    return executeAction("SHIPPING_SALE_ORDER", orderId);
}

/* SHIPPING */

function tabShipping() {
    ReactDOM.render(
        <Shippings
            getShippings={getShippings}
            searchShippings={searchShippings}
            getShippingPackaging={getShippingPackaging}
            addShipping={addShipping}
            updateShipping={updateShipping}
            deleteShipping={deleteShipping}
            locateAddress={locateAddressByCustomer}
            findCarrierByName={findCarrierByName}
            locateSaleOrder={locateSaleOrder}
            getNameAddress={getNameAddress}
            locateSaleDeliveryNote={locateSaleDeliveryNote}
            getNameSaleDeliveryNote={getNameSaleDeliveryNote}
            tabShipping={tabShipping}
            toggleShippingSent={toggleShippingSent}
            documentFunctions={getDocumenetFunctions()}
        />,
        document.getElementById('renderTab'));
}

function getShippings() {
    return getRows("SHIPPINGS");
}

function searchShippings(search) {
    return searchRows("SHIPPING", search);
}

function getShippingPackaging(shippingId) {
    return getRows("SHIPPING_PACKAGING", shippingId);
}

function addShipping(shipping) {
    return addRows("SHIPPING", shipping);
}

function updateShipping(shipping) {
    return updateRows("SHIPPING", shipping);
}

function deleteShipping(shippingId) {
    return deleteRows("SHIPPING", shippingId);
}

function locateSaleOrder() {
    return locateRows("SALE_ORDER");
}

function locateSaleDeliveryNote(orderId) {
    return locateRows("SALE_DELIVERY_NOTE", orderId);
}

function getNameSaleDeliveryNote(noteId) {
    return getRecordName("SALE_DELIERY_NOTE", noteId);
}

function toggleShippingSent(shippingId) {
    return executeAction("TOGGLE_SHIPPING_SENT", shippingId);
}

/* USERS */

function tabUsers() {
    ReactDOM.render(
        <Users
            getUsers={getUsers}
            addUser={addUser}
            updateUser={updateUser}
            deleteUser={deleteUser}
            passwordUser={passwordUser}
            offUser={offUser}
            getUserGroups={getUserGroups}
            insertUserGroup={insertUserGroup}
            deleteUserGroup={deleteUserGroup}
        />,
        document.getElementById('renderTab'));
}

function getUsers() {
    return getRows("USERS");
}

function addUser(user) {
    return addRows("USER", user);
}

function updateUser(user) {
    return updateRows("USER", user);
}

function deleteUser(user) {
    return deleteRows("USER", user);
}

function passwordUser(usrPwd) {
    return executeAction("USER_PWD", JSON.stringify(usrPwd));
}

function offUser(userId) {
    return executeAction("USER_OFF", JSON.stringify({ id: userId }));
}

function getUserGroups(userId) {
    return getRows("GET_USER_GROUPS", userId);
}

function insertUserGroup(userGroup) {
    return addRows("USER_GROUP", userGroup);
}

function deleteUserGroup(userGroup) {
    return deleteRows("USER_GROUP", JSON.stringify(userGroup));
}

/* GROUPS */

function tabGroups() {
    ReactDOM.render(
        <Groups
            getGroups={getGroups}
            addGroup={addGroup}
            updateGroup={updateGroup}
            deleteGroup={deleteGroup}
        />,
        document.getElementById('renderTab'));
}

function getGroups() {
    return getRows("GROUPS");
}

function addGroup(group) {
    return addRows("GROUP", group);
}

function updateGroup(group) {
    return updateRows("GROUP", group);
}

function deleteGroup(groupId) {
    return deleteRows("GROUP", groupId);
}

/* SETTINGS */

async function tabSettings() {
    const settings = await getSettings();

    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <Settings
            settings={settings}
            findWarehouseByName={findWarehouseByName}
            updateSettings={updateSettings}
        />,
        document.getElementById('renderTab'));
}

function getSettings() {
    return getRows("SETTINGS");
}

function updateSettings(settings) {
    return updateRows("SETTINGS", settings);
}



main();
