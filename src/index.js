/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/



import React from 'react';
import ReactDOM from 'react-dom';
import dateFormat from './date.format.js'
import global_config from './config.json';
import './index.css';
import App from './App';
import i18next from 'i18next';
import strings_en from './STRINGS/en.json';
import strings_es from './STRINGS/es.json';
import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
} from 'chart.js';
import Menu from './COMPONENTS/Menu';
import SalesOrders from './COMPONENTS/Sales/Orders/SalesOrders';
import Addresses from './COMPONENTS/Masters/Addresses/Addresses';
import BillingSeries from './COMPONENTS/Masters/BillingSeries/BillingSeries';
import Currencies from './COMPONENTS/Masters/Currencies/Currencies';
import PaymentMethods from './COMPONENTS/Masters/PaymentMethod/PaymentMethods';
import Warehouses from './COMPONENTS/Warehouse/Warehouse/Warehouses';
import Languages from './COMPONENTS/Masters/Languages/Languages';
import Countries from './COMPONENTS/Masters/Countries/Countries';
import States from './COMPONENTS/Masters/States/States';
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
import PrestaShopZones from './COMPONENTS/PrestaShop/Zones/PrestaShopZones.js';
import Connections from './COMPONENTS/Utils/Connections/Connections.js';
import About from './COMPONENTS/Utils/About/About.js';
import CollectShippings from './COMPONENTS/Preparation/CollectShippings/CollectShippings.js';
import Journals from './COMPONENTS/Accounting/Journals/Journals.js';
import Accounts from './COMPONENTS/Accounting/Accounts/Accounts.js';
import AccountingMovements from './COMPONENTS/Accounting/AccountingMovements/AccountingMovements.js';
import PostSalesInvoices from './COMPONENTS/Accounting/PostSaleInvoices/PostSalesInvoices.js';
import PostPurchaseInvoices from './COMPONENTS/Accounting/PostPurchaseInvoices/PostPurchaseInvoices.js';
import Charges from './COMPONENTS/Accounting/Charges/Charges.js';
import Payments from './COMPONENTS/Accounting/Payments/Payments.js';
import MonthlySalesAmount from './COMPONENTS/Analytics/Sales/MonthlySalesAmount.js';
import MonthlySalesQuantity from './COMPONENTS/Analytics/Sales/MonthlySalesQuantity.js';
import SalesOfAProductQuantity from './COMPONENTS/Analytics/Sales/SalesOfAProductQuantity.js';
import SalesOfAProductAmount from './COMPONENTS/Analytics/Sales/SalesOfAProductAmount.js';
import DaysOfServiceSaleOrders from './COMPONENTS/Analytics/Sales/DaysOfServiceSaleOrders.js';
import DaysOfServicePurchaseOrders from './COMPONENTS/Analytics/Purchases/DaysOfServicePurchaseOrders.js';
import MonthlyPurchaseAmount from './COMPONENTS/Analytics/Purchases/MonthlyPurchaseAmount.js';
import PaymentMethodsSaleOrdersQuantity from './COMPONENTS/Analytics/Sales/PaymentMethodsSaleOrdersQuantity.js';
import CountriesSaleOrdersAmount from './COMPONENTS/Analytics/Sales/CountriesSaleOrdersAmount.js';
import ManufacturingQuantity from './COMPONENTS/Analytics/Manufacturing/ManufacturingQuantity.js';
import DailyShippingQuantity from './COMPONENTS/Analytics/Preparation/DailyShippingQuantity.js';
import ShippingsByCarrier from './COMPONENTS/Analytics/Preparation/ShippingsByCarrier.js';
import ApiKeys from './COMPONENTS/Utils/ApiKeys/ApiKeys.js';
import ConnectionLog from './COMPONENTS/Utils/ConnectionLog/ConnectionLog.js';
import ConnectionFilters from './COMPONENTS/Utils/ConnectionFilters/ConnectionFilters.js';
import ReportTemplates from './COMPONENTS/Utils/ReportTemplates/ReportTemplates.js';
import ChangePassword from './COMPONENTS/Utils/ChangePassword/ChangePassword.js';
import EmailLogs from './COMPONENTS/Utils/EmailLogs/EmailLogs.js';
import ComplexManufacturingOrders from './COMPONENTS/Manufacturing/ComplexOrders/ComplexManufacturingOrders.js';
import POSTerminals from './COMPONENTS/Utils/POSTerminals/POSTerminals.js';
import POSTerminalSaleOrders from './COMPONENTS/Sales/POSTerminal/POSTerminalSaleOrders.js';
import PermissionDictionary from './COMPONENTS/Utils/PermissionDictionary/PermissionDictionary.js';
import TrialBalance from './COMPONENTS/Accounting/TrialBalance/TrialBalance.js';
import ReportTemplateTranslation from './COMPONENTS/Utils/ReportTemplateTranslation/ReportTemplateTranslation.js';
import Benefits from './COMPONENTS/Analytics/Sales/Benefits.js';
import Report111 from './COMPONENTS/Accounting/Reports/Report111.js';
import Report115 from './COMPONENTS/Accounting/Reports/Report115.js';
import Inventory from './COMPONENTS/Warehouse/Inventory/Inventory.js';
import InventoyValuation from './COMPONENTS/Accounting/Warehouse/InventoyValuation.js';
import WebHookSettings from './COMPONENTS/Utils/WebHook/WebHookSettings.js';
import TransferBetweenWarehousesMenu from './COMPONENTS/Warehouse/TransferBetweenWarehouses/TransferBetweenWarehouses.js';
import Intrastat from './COMPONENTS/Accounting/Intrastat/Intrastat.js';
import GenerateManufacturingOrders from './COMPONENTS/Sales/GenerateManufacturingOrders/GenerateManufacturingOrders.js';
import ConfirmQuestion from './COMPONENTS/ConfirmQuestion.js';
import DeprecatedProducts from './COMPONENTS/Masters/ProductManager/DeprecatedProducts/DeprecatedProducts.js';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// WebSocket
var ws;
var config;
var permissions;
// 'en' or 'es'
var language;
var attempedLogin = false;
var attempedLoginGoogleAuth = false;
// Saved searches, key: string, value: object
window.savedSearches = {};



function main() {
    i18nextInit();
    ws = new WebSocket((window.location.protocol == 'https:' ? 'wss' : 'ws')
        + '://' + window.location.hostname + ':' + global_config.websocket.port + '/' + global_config.websocket.path)
    console.log(ws);
    window.global_config = global_config;
    ws.onopen = () => {
        // attempt login via token
        loginToken().then((ok) => {
            if (ok.ok) {
                getClientSettings().then((conf) => {
                    config = conf;
                    window.config = config;
                    renderMenu();
                });
            } else {
                if (ok.reason == 1) {
                    ReactDOM.render(
                        <ErrorScreen
                            errorTitle={i18next.t('CONNECTION-DISABLED-BY-THE-ADMINISTRATOR')}
                            errorDescription={i18next.t('CONNECTION-DISABLED-BY-THE-ADMINISTRATOR-DESC')}
                            extraData={i18next.t('reason') + ": " + ok.extraData[0]}
                            image={1}
                        />, document.getElementById('root'));
                } else {
                    attempedLogin = true;
                    ReactDOM.render(
                        <Login
                            login={login}
                            loginGoogleAuth={loginGoogleAuth}
                            handleMenu={() => {
                                attempedLogin = false;
                                getClientSettings().then((conf) => {
                                    config = conf;
                                    window.config = config;
                                    renderMenu();
                                });
                            }}
                            handleAbout={aboutWindow}
                        />,
                        document.getElementById('root'));
                }
            }
        });
    }
    ws.onclose = (err) => {
        console.log(err);
        if (attempedLoginGoogleAuth) {
            ReactDOM.render(
                <ErrorScreen
                    errorTitle={i18next.t('GOOGLE-AUTHENTICATOR-ERROR')}
                    errorDescription={i18next.t('GOOGLE-AUTHENTICATOR-ERROR-DESC')}
                    image={3}
                />, document.getElementById('root'));
        } else if (attempedLogin) {
            ReactDOM.render(
                <ErrorScreen
                    errorTitle={i18next.t('MAXIMUM-LOGIN-ATTEMPTS-EXCEEDED')}
                    errorDescription={i18next.t('MAXIMUM-LOGIN-ATTEMPTS-EXCEEDED-DESC')}
                    image={4}
                />, document.getElementById('root'));
        } else {
            ReactDOM.render(
                <ErrorScreen
                    errorTitle={i18next.t('CONNECTION-WITH-THE-SERVER-HAS-BEEN-LOST')}
                    errorDescription={i18next.t('CONNECTION-WITH-THE-SERVER-HAS-BEEN-LOST-DESC')}
                    image={5}
                />, document.getElementById('root'));
        }
    }
}

function loginToken() {
    const token = getCookie("token");
    if (token !== undefined && token.length > 0) {
        return new Promise((resolve) => {
            ws.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                permissions = data.permissions;
                language = data.language;
                document.cookie = "token=" + data.token;
                resolve(data);
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
            const data = JSON.parse(msg.data);
            permissions = data.permissions;
            language = data.language;
            resolve(data);
        }
        ws.send(JSON.stringify(loginData));
    });
}

function loginGoogleAuth(token) {
    attempedLoginGoogleAuth = true;
    return new Promise((resolve) => {
        ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            permissions = data.permissions;
            language = data.language;
            attempedLoginGoogleAuth = !data.ok;
            resolve(data);
        }
        ws.send(token);
    });
}

function i18nextInit() {
    var resources;
    if (language == 'en') {
        resources = strings_en;
    } else if (language == 'es') {
        resources = strings_es;
    } else {
        var lang = (navigator.language || navigator.userLanguage).substring(0, 2) == 'es' ? 'es' : 'en';
        language = lang;
        if (lang == 'en') {
            resources = strings_en;
        } else if (lang == 'es') {
            resources = strings_es;
        } else {
            resources = strings_en;
        }
    }

    i18next.init({
        lng: language,
        interpolation: { escapeValue: false },
        fallbackLng: 'en',
        whitelist: ['en', 'es'],
        resources: resources
    });
}

/***
 * Adds or replace a saved search.
 * @param key string
 * @param object object
 * */
window.addSavedSearches = (key, object) => {
    window.savedSearches[key] = object;
}

/***
 * @param key string
 * @returns object
 * */
window.getSavedSearches = (key) => {
    if (window.savedSearches[key] != null) {
        return window.savedSearches[key];
    } else {
        return null;
    }
}

/**
 * @returns [0, 1400]
 * */
document.getScroll = () => {
    if (window.pageYOffset != undefined) {
        return [window.pageXOffset, window.pageYOffset];
    } else {
        var sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sx, sy];
    }
}

window.validateEmail = (email) => {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return String(email)
        .toLowerCase()
        .match(re);
};

window.phoneIsValid = (phone) => {
    const VALID_CHARACTERS = "0123456789()-+. ";
    for (let i = 0; i < phone.length; i++) {
        if (VALID_CHARACTERS.indexOf(phone[i]) == -1) {
            return false
        }
    }
    return true
};

window.getLanguages = () => {
    return getRows("LANGUAGE");
};

/**
 * Determines if the current user has a dynamic permission set in the permission dictionary.
 * */
window.getPermission = (permissionKey) => {
    return permissions.permissionDictionary.indexOf(permissionKey) > -1;
}

function renderMenu() {
    i18nextInit();
    Chart.register(
        ArcElement,
        LineElement,
        BarElement,
        PointElement,
        BarController,
        BubbleController,
        DoughnutController,
        LineController,
        PieController,
        PolarAreaController,
        RadarController,
        ScatterController,
        CategoryScale,
        LinearScale,
        LogarithmicScale,
        RadialLinearScale,
        TimeScale,
        TimeSeriesScale,
        Decimation,
        Filler,
        Legend,
        Title,
        Tooltip
    );

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
            handleStates={tabStates}
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
            handleCollectShipping={tabCollectShipping}
            handleSettings={tabSettings}
            handleUsers={tabUsers}
            handleGroups={tabGroups}
            handleConnections={tabConnections}
            handleAbout={aboutWindow}
            handleImportFromPrestaShop={importFromPrestaShop}
            handlePSZones={tabPrestaShopZones}
            prestaShopVisible={config.ecommerce == "P"}
            permissions={permissions}
            logout={logout}
            handleJournals={tabJournals}
            handleAccounts={tabAccounts}
            handleAccountingMovements={tabAccountingMovements}
            handlePostSalesInvoices={tabPostSalesInvoices}
            handlePostPurchaseInvoices={tabPostPurchaseInvoices}
            handleCharges={tabCharges}
            handlePayments={tabPayments}
            handleMonthlySalesAmount={tabMonthlySalesAmount}
            handleMonthlySalesQuantity={tabMonthlySalesQuantity}
            handleSalesOfAProductQuantity={tabSalesOfAProductQuantity}
            handleSalesOfAProductAmount={tabSalesOfAProductAmount}
            handleDaysOfServiceSaleOrders={tabDaysOfServiceSaleOrders}
            handleDaysOfServicePurchaseOrders={tabDaysOfServicePurchaseOrders}
            handleMonthlyPurchaseAmount={tabMonthlyPurchaseAmount}
            handlePaymentMethodsSaleOrdersQuantity={tabPaymentMethodsSaleOrdersQuantity}
            handleCountriesSaleOrdersAmount={tabCountriesSaleOrdersAmount}
            handleManufacturingQuantity={tabManufacturingQuantity}
            handleDailyShippingQuantity={tabDailyShippingQuantity}
            handleShippingsByCarrier={tabShippingsByCarrier}
            handleApiKeys={tabApiKeys}
            wooCommerceVisible={config.ecommerce == "W"}
            handleImportFromWooCommerce={importFromWooCommerce}
            handleConnectionLog={tabConnectionLog}
            handleConnectionFilters={tabConnectionFilters}
            shopifyVisible={config.ecommerce == "S"}
            handleImportFromShopify={importFromShopify}
            tabReportTemplates={tabReportTemplates}
            tabEmailLogs={tabEmailLogs}
            handleChangePassword={tabChangePassword}
            handleComplexManufacturingOrders={tabComplexManufacturingOrders}
            handlePosTerminals={tabPosTerminals}
            handlePOSTerminalSaleOrders={tabPOSTerminalSaleOrders}
            handlePermissionDictionary={tabPermissionDictionary}
            handleTrialBalance={tabTrialBalance}
            handleReportTemplateTranslation={tabReportTemplateTranslation}
            handleStatisticsBenefits={tabStatisticsBenefits}
            handleReport111={tabReport111}
            handleReport115={tabReport115}
            handleInventory={tabInventory}
            handleInventoyValuation={tabInventoyValuation}
            handleWebHookSettings={tabWebHookSettings}
            tabTransferBetweenWarehouses={tabTransferBetweenWarehouses}
            tabIntrastat={tabIntrastat}
            tabGenerateManufacturingOrders={tabGenerateManufacturingOrders}
            deleteAllLoginTokens={deleteAllLoginTokens}
            disconnectAllConnections={disconnectAllConnections}
            forceAllUsersToChangePassowrds={forceAllUsersToChangePassowrds}
            regenerateDraggedStockAllWarehouses={regenerateDraggedStockAllWarehouses}
            regenerateStockRecords={regenerateStockRecords}
            tabDeprecatedProducts={tabDeprecatedProducts}
        />,
        document.getElementById('root'));

    mustChangeUserPassword();
}

function mustChangeUserPassword() {
    getCurrentUserRow().then((user) => {
        if (user.pwdNextLogin) {
            tabChangePassword(true);
        }
    });
}

window.dateFormat = (date) => {
    return dateFormat(date, config.dateFormat);//"yyyy-mm-dd HH:MM:ss"
}

window.timeHourMinuteFormat = (date) => {
    return dateFormat(date, "HH:MM");
}

window.bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)));
    return Math.round(bytes / Math.pow(1000, i), 2) + ' ' + sizes[i];
}

function logout() {
    document.cookie = "token=";
    setTimeout(() => {
        window.location.reload();
    }, 100);
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

function getRegisterTransactionalLogs(tableName, registerId) {
    return getRows("REGISTER_TRANSACTIONAL_LOG", JSON.stringify({
        tableName,
        registerId
    }));
}



/* SALES ORDERS */

function tabSalesOrders() {
    ReactDOM.render(
        <SalesOrders
            findCustomerByName={findCustomerByName}
            findPaymentMethodByName={findPaymentMethodByName}
            findCurrencyByName={findCurrencyByName}
            findBillingSerieByName={findBillingSerieByName}
            getCustomerDefaults={getCustomerDefaults}
            locateAddress={locateAddressByCustomer}
            tabSalesOrders={tabSalesOrders}
            getSalesOrder={getSalesOrder}
            getSalesOrderRow={getSalesOrderRow}
            searchSalesOrder={searchSalesOrder}
            addSalesOrder={addSalesOrder}
            updateSalesOrder={updateSalesOrder}
            deleteSalesOrder={deleteSalesOrder}
            getOrderDetailsDefaults={getOrderDetailsDefaults}
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
            getCustomerRow={getCustomerRow}
            sendEmail={sendEmail}
            documentFunctions={getDocumenetFunctions()}
            locateCustomers={locateCustomers}
            locateProduct={locateProduct}
            cancelSalesOrderDetail={cancelSalesOrderDetail}
            getPurchasesOrderDetailsFromSaleOrderDetail={getPurchasesOrderDetailsFromSaleOrderDetail}
            locateCurrency={locateCurrency}
            locatePaymentMethods={locatePaymentMethods}
            locateCarriers={locateCarriers}
            locateBillingSeries={locateBillingSeries}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}

            getSalesOrderDetailDigitalProductData={getSalesOrderDetailDigitalProductData}
            insertSalesOrderDetailDigitalProductData={insertSalesOrderDetailDigitalProductData}
            updateSalesOrderDetailDigitalProductData={updateSalesOrderDetailDigitalProductData}
            deleteSalesOrderDetailDigitalProductData={deleteSalesOrderDetailDigitalProductData}
            setDigitalSalesOrderDetailAsSent={setDigitalSalesOrderDetailAsSent}
            getProductIncludedProductSalesOrderDetail={getProductIncludedProductSalesOrderDetail}

            getAddressesFunctions={getAddressesFunctions}
            getCustomersFunctions={getCustomersFunctions}
            getSalesInvoicesFuntions={getSalesInvoicesFuntions}
            getSalesDeliveryNotesFunctions={getSalesDeliveryNotesFunctions}
            getManufacturingOrdersFunctions={getManufacturingOrdersFunctions}
            getShippingFunctions={getShippingFunctions}
            getProductFunctions={getProductFunctions}
            getComplexManufacturingOrerFunctions={getComplexManufacturingOrerFunctions}
        />,
        document.getElementById('renderTab'));
}

function getSalesOrdersFunctions() {
    return {
        findCustomerByName,
        findPaymentMethodByName,
        findCurrencyByName,
        findBillingSerieByName,
        getCustomerDefaults,
        locateAddressByCustomer,
        getSalesOrderRow,
        searchSalesOrder,
        addSalesOrder,
        updateSalesOrder,
        deleteSalesOrder,
        getOrderDetailsDefaults,
        findProductByName,
        getSalesOrderDetails,
        addSalesOrderDetail,
        updateSalesOrderDetail,
        deleteSalesOrderDetail,
        getSalesOrderDiscounts,
        addSalesOrderDiscounts,
        deleteSalesOrderDiscounts,
        invoiceAllSaleOrder,
        invoiceSelectionSaleOrder,
        getSalesOrderRelations,
        manufacturingOrderAllSaleOrder,
        manufacturingOrderPartiallySaleOrder,
        deliveryNoteAllSaleOrder,
        deliveryNotePartiallySaleOrder,
        findCarrierByName,
        getCustomerRow,
        sendEmail,
        documentFunctions: getDocumenetFunctions(),
        locateCustomers,
        locateProduct,
        cancelSalesOrderDetail,
        getPurchasesOrderDetailsFromSaleOrderDetail,
        locateCurrency,
        locatePaymentMethods,
        locateCarriers,
        locateBillingSeries,
        getRegisterTransactionalLogs,
        getAddressesFunctions,
        getCustomersFunctions,
        getSalesInvoicesFuntions,
        getSalesDeliveryNotesFunctions,
        getManufacturingOrdersFunctions,
        getShippingFunctions,
        getProductFunctions,
        getSalesOrderDetailDigitalProductData,
        insertSalesOrderDetailDigitalProductData,
        updateSalesOrderDetailDigitalProductData,
        deleteSalesOrderDetailDigitalProductData,
        setDigitalSalesOrderDetailAsSent,
        getProductIncludedProductSalesOrderDetail,
        getComplexManufacturingOrerFunctions,
    }
}

function getCustomerDefaults(customerId) {
    return getResourceDefaults("CUSTOMER", customerId);
}

function getSalesOrder(query) {
    return getRows("SALES_ORDER", JSON.stringify(query));
}

function getSalesOrderRow(orderId) {
    return getRows("SALES_ORDER_ROW", orderId);
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

function getCustomerRow(customerId) {
    return getRows("CUSTOMER_ROW", customerId);
}

function sendEmail(email) {
    return executeAction("EMAIL", JSON.stringify(email));
}

function locateCustomers(query) {
    return locateRows("LOCATE_CUSTOMER", JSON.stringify(query));
}

function locateProduct(query) {
    return locateRows("LOCATE_PRODUCT", JSON.stringify(query));
}

function cancelSalesOrderDetail(detailId) {
    return executeAction("CANCEL_SALES_ORDER_DETAIL", detailId);
}

function getPurchasesOrderDetailsFromSaleOrderDetail(detailId) {
    return getRows("PURCHASES_ORDER_DETAILS_FROM_SALE_ORDER_DETAIL", detailId);
}

function locateCurrency() {
    return locateRows("CURRENCIES");
}

function locatePaymentMethods() {
    return locateRows("PAYMENT_METHOD");
}

function locateCarriers() {
    return locateRows("CARRIER");
}

function locateBillingSeries() {
    return locateRows("BILLING_SERIE");
}

function getSalesOrderDetailDigitalProductData(salesOrderDetailId) {
    return getRows("SALES_ORDER_DETAIL_DIGITAL_PRODUCT_DATA", salesOrderDetailId);
}

function insertSalesOrderDetailDigitalProductData(productData) {
    return addRows("SALES_ORDER_DETAIL_DIGITAL_PRODUCT_DATA", productData);
}

function updateSalesOrderDetailDigitalProductData(productData) {
    return updateRows("SALES_ORDER_DETAIL_DIGITAL_PRODUCT_DATA", productData);
}

function deleteSalesOrderDetailDigitalProductData(productDataId) {
    return deleteRows("SALES_ORDER_DETAIL_DIGITAL_PRODUCT_DATA", productDataId);
}

function setDigitalSalesOrderDetailAsSent(data) {
    return executeAction("SET_DIGITAL_SALES_ORDER_DETAIL_AS_SENT", JSON.stringify(data));
}

function getProductIncludedProductSalesOrderDetail(salesOrderDetailId) {
    return getRows("PRODUCT_INCLUDED_PRODUCTS_SALES_ORDER_DETAIL", salesOrderDetailId);
}

/* SALES INVOICES */

function tabSalesInvoices() {
    ReactDOM.render(
        <SalesInvoices
            getSalesInvoices={getSalesInvoices}
            getSalesInvoicesRow={getSalesInvoicesRow}
            searchSalesInvoices={searchSalesInvoices}

            findCustomerByName={findCustomerByName}
            findPaymentMethodByName={findPaymentMethodByName}
            findCurrencyByName={findCurrencyByName}
            findBillingSerieByName={findBillingSerieByName}
            getCustomerDefaults={getCustomerDefaults}
            locateAddress={locateAddressByCustomer}
            tabSalesInvoices={tabSalesInvoices}

            findProductByName={findProductByName}
            getOrderDetailsDefaults={getOrderDetailsDefaults}
            getSalesInvoiceDetails={getSalesInvoiceDetails}
            addSalesInvoiceDetail={addSalesInvoiceDetail}
            deleteSalesInvoiceDetail={deleteSalesInvoiceDetail}
            addSalesInvoice={addSalesInvoice}
            deleteSalesInvoice={deleteSalesInvoice}
            getSalesInvoiceRelations={getSalesInvoiceRelations}
            getCustomerRow={getCustomerRow}
            sendEmail={sendEmail}
            documentFunctions={getDocumenetFunctions()}
            locateCustomers={locateCustomers}
            locateProduct={locateProduct}
            toggleSimplifiedInvoiceSalesInvoice={toggleSimplifiedInvoiceSalesInvoice}
            makeAmendingSaleInvoice={makeAmendingSaleInvoice}
            locateCurrency={locateCurrency}
            locatePaymentMethods={locatePaymentMethods}
            locateBillingSeries={locateBillingSeries}
            invoiceDeletePolicy={config.invoiceDeletePolicy}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}

            getAddressesFunctions={getAddressesFunctions}
            getCustomersFunctions={getCustomersFunctions}
            getSalesOrdersFunctions={getSalesOrdersFunctions}
            getSalesDeliveryNotesFunctions={getSalesDeliveryNotesFunctions}
            getAccountingMovementsFunction={getAccountingMovementsFunction}
            getProductFunctions={getProductFunctions}
            getSalesInvoicesFuntions={getSalesInvoicesFuntions}
        />,
        document.getElementById('renderTab'));
}

function getSalesInvoicesFuntions() {
    return {
        findCustomerByName,
        findPaymentMethodByName,
        findCurrencyByName,
        findBillingSerieByName,
        getCustomerDefaults,
        locateAddressByCustomer,
        findProductByName,
        getOrderDetailsDefaults,
        getSalesInvoiceDetails,
        addSalesInvoiceDetail,
        deleteSalesInvoiceDetail,
        addSalesInvoice,
        deleteSalesInvoice,
        getSalesInvoiceRelations,
        getCustomerRow,
        sendEmail,
        documentFunctions: getDocumenetFunctions(),
        locateCustomers,
        locateProduct,
        toggleSimplifiedInvoiceSalesInvoice,
        makeAmendingSaleInvoice,
        locateCurrency,
        locatePaymentMethods,
        locateBillingSeries,
        getRegisterTransactionalLogs,
        getAddressesFunctions,
        getCustomersFunctions,
        getSalesOrdersFunctions,
        getSalesDeliveryNotesFunctions,
        getProductFunctions,
        getSalesInvoicesFuntions,
        invoiceDeletePolicy: config.invoiceDeletePolicy,
        getSalesInvoicesRow
    }
}

function getSalesInvoices(query) {
    return getRows("SALES_INVOICE", JSON.stringify(query));
}

function getSalesInvoicesRow(invoiceId) {
    return getRows("SALES_INVOICE_ROW", invoiceId);
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

function toggleSimplifiedInvoiceSalesInvoice(invoiceId) {
    return executeAction("TOGGLE_SIMPLIFIED_INVOICE_SALES_INVOICE", invoiceId);
}

function makeAmendingSaleInvoice(invoiceInfo) {
    return executeAction("MAKE_AMENDING_SALE_INVOICE", JSON.stringify(invoiceInfo));
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
            findPaymentMethodByName={findPaymentMethodByName}
            findCurrencyByName={findCurrencyByName}
            findBillingSerieByName={findBillingSerieByName}
            getCustomerDefaults={getCustomerDefaults}
            locateAddress={locateAddressByCustomer}
            tabSalesDeliveryNotes={tabSalesDeliveryNotes}
            getSalesDeliveryNoteDetails={getSalesDeliveryNoteDetails}
            findProductByName={findProductByName}
            addWarehouseMovements={addWarehouseMovements}
            deleteWarehouseMovements={deleteWarehouseMovements}
            getSalesDeliveryNotesRelations={getSalesDeliveryNotesRelations}
            getCustomerRow={getCustomerRow}
            sendEmail={sendEmail}
            documentFunctions={getDocumenetFunctions()}
            getSalesDeliveryNoteRow={getSalesDeliveryNoteRow}
            locateCustomers={locateCustomers}
            locateProduct={locateProduct}
            locateCurrency={locateCurrency}
            locatePaymentMethods={locatePaymentMethods}
            locateBillingSeries={locateBillingSeries}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            getWarehouses={getWarehouses}

            getAddressesFunctions={getAddressesFunctions}
            getCustomersFunctions={getCustomersFunctions}
            getSalesOrdersFunctions={getSalesOrdersFunctions}
            getProductFunctions={getProductFunctions}
            getShippingFunctions={getShippingFunctions}
        />,
        document.getElementById('renderTab'));
}

function getSalesDeliveryNotesFunctions() {
    return {
        getSalesDeliveryNotes,
        addSalesDeliveryNotes,
        deleteSalesDeliveryNotes,

        findCustomerByName,
        findPaymentMethodByName,
        findCurrencyByName,
        findBillingSerieByName,
        getCustomerDefaults,
        locateAddressByCustomer,
        getSalesDeliveryNoteDetails,
        findProductByName,
        addWarehouseMovements,
        deleteWarehouseMovements,
        getSalesDeliveryNotesRelations,
        sendEmail,
        documentFunctions: getDocumenetFunctions(),
        getSalesDeliveryNoteRow,
        locateCustomers,
        locateProduct,
        locateCurrency,
        locatePaymentMethods,
        locateBillingSeries,
        getRegisterTransactionalLogs,
        getWarehouses,
        getAddressesFunctions,
        getCustomersFunctions,
        getSalesOrdersFunctions,
        getProductFunctions,
        getShippingFunctions
    }
}

function getSalesDeliveryNotes(query) {
    return getRows("SALES_DELIVERY_NOTES", JSON.stringify(query));
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

function getSalesDeliveryNoteRow(noteId) {
    return getRows("SALES_DELIVERY_NOTE_ROW", noteId);
}

/* GENERATE MANUFACTURING ORDERS */

function tabGenerateManufacturingOrders() {
    ReactDOM.render(
        <GenerateManufacturingOrders
            getSalesOrderDetailWaitingForManufacturingOrders={getSalesOrderDetailWaitingForManufacturingOrders}
            manufacturingOrderPartiallySaleOrder={manufacturingOrderPartiallySaleOrder}
        />,
        document.getElementById('renderTab'));
}

function getSalesOrderDetailWaitingForManufacturingOrders() {
    return getRows("SALES_ORDER_DETAIL_WAITING_FOR_MANUFACTURING_ORDERS");
}

/* PURCHASE ORDERS */

function tabPurchaseOrders() {
    ReactDOM.render(
        <PurchaseOrders
            findSupplierByName={findSupplierByName}
            findPaymentMethodByName={findPaymentMethodByName}
            findCurrencyByName={findCurrencyByName}
            findBillingSerieByName={findBillingSerieByName}
            getSupplierDefaults={getSupplierDefaults}
            locateAddress={locateAddressBySupplier}
            tabPurchaseOrders={tabPurchaseOrders}
            getPurchaseOrder={getPurchaseOrder}
            getPurchaseOrderRow={getPurchaseOrderRow}
            searchPurchaseOrder={searchPurchaseOrder}
            addPurchaseOrder={addPurchaseOrder}
            updatePurchaseOrder={updatePurchaseOrder}
            deletePurchaseOrder={deletePurchaseOrder}
            getOrderDetailsDefaults={getOrderDetailsDefaults}
            findProductByName={findProductByName}
            getPurchaseOrderDetails={getPurchaseOrderDetails}
            addPurchaseOrderDetail={addPurchaseOrderDetail}
            updatePurchaseOrderDetail={updatePurchaseOrderDetail}
            deletePurchaseOrderDetail={deletePurchaseOrderDetail}
            cancelPurchaseOrderDetail={cancelPurchaseOrderDetail}
            getSalesOrderDiscounts={getSalesOrderDiscounts}
            addSalesOrderDiscounts={addSalesOrderDiscounts}
            deleteSalesOrderDiscounts={deleteSalesOrderDiscounts}
            invoiceAllPurchaseOrder={invoiceAllPurchaseOrder}
            invoicePartiallyPurchaseOrder={invoicePartiallyPurchaseOrder}
            getPurchaseOrderRelations={getPurchaseOrderRelations}
            deliveryNoteAllPurchaseOrder={deliveryNoteAllPurchaseOrder}
            deliveryNotePartiallyPurchaseOrder={deliveryNotePartiallyPurchaseOrder}
            findCarrierByName={findCarrierByName}
            getSupplierRow={getSupplierRow}
            sendEmail={sendEmail}
            documentFunctions={getDocumenetFunctions()}
            locateSuppliers={locateSuppliers}
            locateProduct={locateProduct}
            getSalesOrderDetailsFromPurchaseOrderDetail={getSalesOrderDetailsFromPurchaseOrderDetail}
            locateCurrency={locateCurrency}
            locatePaymentMethods={locatePaymentMethods}
            locateBillingSeries={locateBillingSeries}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            getComplexManufacturingOrdersFromPurchaseOrderDetail={getComplexManufacturingOrdersFromPurchaseOrderDetail}

            getSupplierFuntions={getSupplierFuntions}
            getAddressesFunctions={getAddressesFunctions}
            getPurcaseInvoicesFunctions={getPurcaseInvoicesFunctions}
            getPurchaseDeliveryNotesFunctions={getPurchaseDeliveryNotesFunctions}
            getProductFunctions={getProductFunctions}
            getComplexManufacturingOrerFunctions={getComplexManufacturingOrerFunctions}
        />,
        document.getElementById('renderTab'));
}

function getPurchaseOrdersFunctions() {
    return {
        findSupplierByName,
        findPaymentMethodByName,
        findCurrencyByName,
        findBillingSerieByName,
        getSupplierDefaults,
        locateAddressBySupplier,
        getPurchaseOrderRow,
        addPurchaseOrder,
        updatePurchaseOrder,
        deletePurchaseOrder,
        getOrderDetailsDefaults,
        findProductByName,
        getPurchaseOrderDetails,
        addPurchaseOrderDetail,
        updatePurchaseOrderDetail,
        deletePurchaseOrderDetail,
        cancelPurchaseOrderDetail,
        getSalesOrderDiscounts,
        addSalesOrderDiscounts,
        deleteSalesOrderDiscounts,
        invoiceAllPurchaseOrder,
        invoicePartiallyPurchaseOrder,
        getPurchaseOrderRelations,
        deliveryNoteAllPurchaseOrder,
        deliveryNotePartiallyPurchaseOrder,
        findCarrierByName,
        getSupplierRow,
        sendEmail,
        documentFunctions: getDocumenetFunctions(),
        locateSuppliers,
        locateProduct,
        getSalesOrderDetailsFromPurchaseOrderDetail,
        locateCurrency,
        locatePaymentMethods,
        locateBillingSeries,
        getRegisterTransactionalLogs,
        getSupplierFuntions,
        getAddressesFunctions,
        getPurcaseInvoicesFunctions,
        getPurchaseDeliveryNotesFunctions,
        getProductFunctions,
        getComplexManufacturingOrdersFromPurchaseOrderDetail,
        getComplexManufacturingOrerFunctions,
    }
}

function getPurchaseOrder() {
    return getRows("PURCHASE_ORDER");
}

function getPurchaseOrderRow(orderId) {
    return getRows("PURCHASE_ORDER_ROW", orderId);
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

function cancelPurchaseOrderDetail(detailId) {
    return executeAction("CANCEL_PURCHASE_ORDER_DETAIL", detailId);
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

function getSupplierRow(supplierId) {
    return getRows("SUPPLIER_ROW", supplierId);
}

function locateSuppliers(query) {
    return locateRows("LOCATE_SUPPLIER", JSON.stringify(query));
}

function getSalesOrderDetailsFromPurchaseOrderDetail(detailId) {
    return getRows("SALES_ORDER_DETAILS_FROM_PURCHASE_ORDER_DETAIL", detailId);
}

function getComplexManufacturingOrdersFromPurchaseOrderDetail(detailId) {
    return getRows("COMPLEX_MANUFACTURING_ORDERS_FROM_PURCHASE_ORDER_DETAIL", detailId);
}

/* PURCHASE INVOICES */

function tabPurcaseInvoices() {
    ReactDOM.render(
        <PurchaseInvoices
            getPurchaseInvoices={getPurchaseInvoices}
            getPurchaseInvoiceRow={getPurchaseInvoiceRow}
            searchPurchaseInvoices={searchPurchaseInvoices}

            findSupplierByName={findSupplierByName}
            findPaymentMethodByName={findPaymentMethodByName}
            findCurrencyByName={findCurrencyByName}
            findBillingSerieByName={findBillingSerieByName}
            getSupplierDefaults={getSupplierDefaults}
            locateAddress={locateAddressBySupplier}
            tabPurcaseInvoices={tabPurcaseInvoices}
            makeAmendingPurchaseInvoice={makeAmendingPurchaseInvoice}

            findProductByName={findProductByName}
            getOrderDetailsDefaults={getOrderDetailsDefaults}
            getPurchaseInvoiceDetails={getPurchaseInvoiceDetails}
            addPurchaseInvoiceDetail={addPurchaseInvoiceDetail}
            deletePurchaseInvoiceDetail={deletePurchaseInvoiceDetail}
            addPurchaseInvoice={addPurchaseInvoice}
            deletePurchaseInvoice={deletePurchaseInvoice}
            getPurchaseInvoiceRelations={getPurchaseInvoiceRelations}
            documentFunctions={getDocumenetFunctions()}
            locateSuppliers={locateSuppliers}
            locateProduct={locateProduct}
            getSupplierRow={getSupplierRow}
            locateCurrency={locateCurrency}
            locatePaymentMethods={locatePaymentMethods}
            locateBillingSeries={locateBillingSeries}
            invoiceDeletePolicy={config.invoiceDeletePolicy}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}

            getSupplierFuntions={getSupplierFuntions}
            getAddressesFunctions={getAddressesFunctions}
            getPurchaseOrdersFunctions={getPurchaseOrdersFunctions}
            getAccountingMovementsFunction={getAccountingMovementsFunction}
            getProductFunctions={getProductFunctions}
            getPurcaseInvoicesFunctions={getPurcaseInvoicesFunctions}
        />,
        document.getElementById('renderTab'));
}

function getPurcaseInvoicesFunctions() {
    return {
        getPurchaseInvoiceRow,
        findSupplierByName,
        findPaymentMethodByName,
        findCurrencyByName,
        findBillingSerieByName,
        getSupplierDefaults,
        locateAddressBySupplier,
        makeAmendingPurchaseInvoice,
        findProductByName,
        getOrderDetailsDefaults,
        getPurchaseInvoiceDetails,
        addPurchaseInvoiceDetail,
        deletePurchaseInvoiceDetail,
        addPurchaseInvoice,
        deletePurchaseInvoice,
        getPurchaseInvoiceRelations,
        documentFunctions: getDocumenetFunctions(),
        locateSuppliers,
        locateProduct,
        getSupplierRow,
        locateCurrency,
        locatePaymentMethods,
        locateBillingSeries,
        getRegisterTransactionalLogs,
        getSupplierFuntions,
        getAddressesFunctions,
        getPurchaseOrdersFunctions,
        getProductFunctions,
        getPurcaseInvoicesFunctions,
        invoiceDeletePolicy: config.invoiceDeletePolicy,
        getSalesInvoicesRow
    }
}

function getPurchaseInvoices() {
    return getRows("PURCHASE_INVOICES");
}

function getPurchaseInvoiceRow(invoiceId) {
    return getRows("PURCHASE_INVOICE_ROW", invoiceId);
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

function makeAmendingPurchaseInvoice(invoiceInfo) {
    return executeAction("MAKE_AMENDING_PURCHASE_INVOICE", JSON.stringify(invoiceInfo));
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
            findPaymentMethodByName={findPaymentMethodByName}
            findCurrencyByName={findCurrencyByName}
            findBillingSerieByName={findBillingSerieByName}
            getSupplierDefaults={getSupplierDefaults}
            locateAddress={locateAddressBySupplier}
            tabPurchaseDeliveryNotes={tabPurchaseDeliveryNotes}
            getPurchaseDeliveryNoteDetails={getPurchaseDeliveryNoteDetails}
            findProductByName={findProductByName}
            addWarehouseMovements={addWarehouseMovements}
            deleteWarehouseMovements={deleteWarehouseMovements}
            getPurchaseDeliveryNotesRelations={getPurchaseDeliveryNotesRelations}
            documentFunctions={getDocumenetFunctions()}
            getPurchaseDeliveryNoteRow={getPurchaseDeliveryNoteRow}
            locateSuppliers={locateSuppliers}
            locateProduct={locateProduct}
            getSupplierRow={getSupplierRow}
            locateCurrency={locateCurrency}
            locatePaymentMethods={locatePaymentMethods}
            locateBillingSeries={locateBillingSeries}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            getWarehouses={getWarehouses}

            getSupplierFuntions={getSupplierFuntions}
            getAddressesFunctions={getAddressesFunctions}
            getPurchaseOrdersFunctions={getPurchaseOrdersFunctions}
            getProductFunctions={getProductFunctions}
        />,
        document.getElementById('renderTab'));
}

function getPurchaseDeliveryNotesFunctions() {
    return {
        addPurchaseDeliveryNotes,
        deletePurchaseDeliveryNotes,
        findSupplierByName,
        findPaymentMethodByName,
        findCurrencyByName,
        findBillingSerieByName,
        getSupplierDefaults,
        locateAddressBySupplier,
        getPurchaseDeliveryNoteDetails,
        findProductByName,
        addWarehouseMovements,
        deleteWarehouseMovements,
        getPurchaseDeliveryNotesRelations,
        findWarehouseByName,
        documentFunctions: getDocumenetFunctions(),
        getPurchaseDeliveryNoteRow,
        locateSuppliers,
        locateProduct,
        getSupplierRow,
        locateCurrency,
        locatePaymentMethods,
        locateBillingSeries,
        getRegisterTransactionalLogs,
        getWarehouses,
        getSupplierFuntions,
        getAddressesFunctions,
        getPurchaseOrdersFunctions,
        getProductFunctions,
    }
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

function getPurchaseDeliveryNoteRow(noteId) {
    return getRows("PURCHASE_DELIVERY_NOTE_ROW", noteId);
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

            findLanguagesByName={findLanguagesByName}
            findCountryByName={findCountryByName}
            findStateByName={findStateByName}
            locatePaymentMethods={locatePaymentMethods}
            locateBillingSeries={locateBillingSeries}

            locateAddress={locateAddressByCustomer}
            getCustomerAddresses={getCustomerAddresses}
            getCustomerSaleOrders={getCustomerSaleOrders}
            locateAccountForCustomer={locateAccountForCustomer}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}

            getAddressesFunctions={getAddressesFunctions}
            getSalesOrdersFunctions={getSalesOrdersFunctions}
            checkVatNumber={checkVatNumber}
            getCustomFieldsFunctions={getCustomFieldsFunctions}
        />,
        document.getElementById('renderTab'));
}

function getCustomersFunctions() {
    return {
        addCustomer,
        updateCustomer,
        deleteCustomer,
        findLanguagesByName,
        findCountryByName,
        findStateByName,
        locatePaymentMethods,
        locateBillingSeries,
        locateAddressByCustomer,
        getCustomerAddresses,
        getCustomerSaleOrders,
        locateAccountForCustomer,
        getRegisterTransactionalLogs,
        getAddressesFunctions,
        getSalesOrdersFunctions,
        checkVatNumber,
    }
}

function getCustomers(query) {
    return getRows("CUSTOMER", JSON.stringify(query));
}

function searchCustomers(search) {
    return searchRows("CUSTOMER", JSON.stringify(search));
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

function locateAddressByCustomer(customerId) {
    return locateRows("ADDRESS_CUSTOMER", customerId);
}

function getCustomerAddresses(customerId) {
    return getRows("CUSTOMER_ADDRESSES", customerId);
}

function getCustomerSaleOrders(customerId) {
    return getRows("CUSTOMER_SALE_ORDERS", customerId);
}

function locateAccountForCustomer() {
    return locateRows("LOCATE_ACCOUNT_CUSTOMER");
}

function checkVatNumber(query) {
    return executeAction("VAT_NUMBER_CHECK", JSON.stringify(query));
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

            findLanguagesByName={findLanguagesByName}
            findCountryByName={findCountryByName}
            findStateByName={findStateByName}
            locatePaymentMethods={locatePaymentMethods}
            locateBillingSeries={locateBillingSeries}

            locateAddress={locateAddressBySupplier}
            locateAccountForSupplier={locateAccountForSupplier}
            getSupplierAddresses={getSupplierAddresses}
            getSupplierPurchaseOrders={getSupplierPurchaseOrders}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            checkVatNumber={checkVatNumber}

            getAddressesFunctions={getAddressesFunctions}
            getPurchaseOrdersFunctions={getPurchaseOrdersFunctions}
            getCustomFieldsFunctions={getCustomFieldsFunctions}
        />,
        document.getElementById('renderTab'));
}

function getSupplierFuntions() {
    return {
        addSupplier,
        updateSupplier,
        deleteSupplier,
        findLanguagesByName,
        findCountryByName,
        findStateByName,
        findPaymentMethodByName,
        findBillingSerieByName,
        locateBillingSeries,
        locateAccountForSupplier,
        getSupplierAddresses,
        getSupplierPurchaseOrders,
        getRegisterTransactionalLogs,
        getAddressesFunctions,
        getPurchaseOrdersFunctions,
        checkVatNumber,
        locatePaymentMethods
    }
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

function getSupplierAddresses(customerId) {
    return getRows("SUPPLIER_ADDRESSES", customerId);
}

function getSupplierPurchaseOrders(customerId) {
    return getRows("SUPPLIER_PURCHASE_ORDERS", customerId);
}

function locateAccountForSupplier() {
    return locateRows("LOCATE_ACCOUNT_SUPPLIER");
}

/* NEEDS */

function tabNeeds() {
    ReactDOM.render(
        <Needs
            getNeeds={getNeeds}
            purchaseNeeds={purchaseNeeds}
            getWarehouses={getWarehouses}
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

            tabProducts={tabProducts}
            getStock={getStock}
            getManufacturingOrderTypes={getManufacturingOrderTypes}
            findSupplierByName={findSupplierByName}
            getProductSalesOrderPending={getProductSalesOrderPending}
            getProductPurchaseOrderPending={getProductPurchaseOrderPending}
            getProductSalesOrder={getProductSalesOrder}
            getProductPurchaseOrder={getProductPurchaseOrder}
            getProductWarehouseMovements={getProductWarehouseMovements}
            getWarehouses={getWarehouses}
            productGenerateBarcode={productGenerateBarcode}
            getProductImages={getProductImages}
            addProductImage={addProductImage}
            updateProductImage={updateProductImage}
            deleteProductImage={deleteProductImage}
            calculateMinimumStock={calculateMinimumStock}
            generateManufacturingOrPurchaseOrdersMinimumStock={generateManufacturingOrPurchaseOrdersMinimumStock}
            productGenerator={productGenerator}
            getProductManufacturingOrders={getProductManufacturingOrders}
            getProductComplexManufacturingOrders={getProductComplexManufacturingOrders}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            locateColor={locateColor}
            locateProductFamilies={locateProductFamilies}
            locateSuppliers={locateSuppliers}
            getProductRow={getProductRow}
            getProductAccounts={getProductAccounts}
            insertProductAccount={insertProductAccount}
            updateProductAccount={updateProductAccount}
            deleteProductAccount={deleteProductAccount}
            locateAccountForSales={locateAccountForSales}
            locateAccountForPurchases={locateAccountForPurchases}
            getHSCodes={getHSCodes}

            getWarehouseMovementFunctions={getWarehouseMovementFunctions}
            getSalesOrdersFunctions={getSalesOrdersFunctions}
            getPurchaseOrdersFunctions={getPurchaseOrdersFunctions}
            getManufacturingOrdersFunctions={getManufacturingOrdersFunctions}
            getComplexManufacturingOrerFunctions={getComplexManufacturingOrerFunctions}
            getManufacturingOrderTypeFunctions={getManufacturingOrderTypeFunctions}
            getCustomFieldsFunctions={getCustomFieldsFunctions}
            getTransferBetweenWarehousesMinimumStockFunctions={getTransferBetweenWarehousesMinimumStockFunctions}
            getProductIncludedProductsFunctions={getProductIncludedProductsFunctions}
        />,
        document.getElementById('renderTab'));
}

function getProductFunctions() {
    return {
        addProduct,
        updateProduct,
        deleteProduct,
        getStock,
        getManufacturingOrderTypes,
        findSupplierByName,
        getProductSalesOrderPending,
        getProductPurchaseOrderPending,
        getProductSalesOrder,
        getProductPurchaseOrder,
        getProductWarehouseMovements,
        getWarehouses,
        productGenerateBarcode,
        getProductImages,
        addProductImage,
        updateProductImage,
        deleteProductImage,
        calculateMinimumStock,
        generateManufacturingOrPurchaseOrdersMinimumStock,
        productGenerator,
        getProductManufacturingOrders,
        getProductComplexManufacturingOrders,
        getRegisterTransactionalLogs,
        locateColor,
        locateProductFamilies,
        locateSuppliers,
        getWarehouseMovementFunctions,
        getSalesOrdersFunctions,
        getPurchaseOrdersFunctions,
        getProductRow,
        getProductAccounts,
        insertProductAccount,
        updateProductAccount,
        deleteProductAccount,
        locateAccountForSales,
        locateAccountForPurchases,
        getHSCodes,
        getManufacturingOrdersFunctions,
        getComplexManufacturingOrerFunctions,
        getManufacturingOrderTypeFunctions,
        getTransferBetweenWarehousesMinimumStockFunctions,
        getProductIncludedProductsFunctions,
    };
}

function getProducts() {
    return getRows("PRODUCT");
}

function searchProducts(search) {
    return searchRows("PRODUCT", JSON.stringify(search));
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

function getProductSalesOrder(query) {
    return getRows("PRODUCT_SALES_ORDER", JSON.stringify(query));
}

function getProductPurchaseOrder(query) {
    return getRows("PRODUCT_PURCHASE_ORDER", JSON.stringify(query));
}

function getProductWarehouseMovements(query) {
    return getRows("PRODUCT_WAREHOUSE_MOVEMENT", JSON.stringify(query));
}

function productGenerateBarcode(productId) {
    return executeAction("PRODUCT_EAN13", productId);
}

function getProductImages(productId) {
    return getRows("PRODUCT_IMAGE", productId);
}

function addProductImage(image) {
    return addRows("PRODUCT_IMAGE", image);
}

function updateProductImage(image) {
    return updateRows("PRODUCT_IMAGE", image);
}

function deleteProductImage(imageId) {
    return deleteRows("PRODUCT_IMAGE", imageId);
}

function calculateMinimumStock() {
    return executeAction("CALCULATE_MINIMUM_STOCK");
}

function generateManufacturingOrPurchaseOrdersMinimumStock(data) {
    return executeAction("GENERATE_MANUFACTURIG_OR_PURCHASE_ORDERS_MINIMUM_STOCK", JSON.stringify(data));
}

function productGenerator(data) {
    return executeAction("PRODUCT_GENERATOR", JSON.stringify(data));
}

function getProductManufacturingOrders(query) {
    return getRows("PRODUCT_MANUFACTURING_ORDERS", JSON.stringify(query));
}

function getProductComplexManufacturingOrders(query) {
    return getRows("PRODUCT_COMPLEX_MANUFACTURING_ORDERS", JSON.stringify(query));
}

function locateColor() {
    return locateRows("COLOR");
}

function locateProductFamilies() {
    return locateRows("PRODUCT_FAMILIES");
}

function getProductAccounts(productId) {
    return getRows("PRODUCT_ACCOUNTS", productId);
}

function insertProductAccount(productAccount) {
    return addRows("PRODUCT_ACCOUNTS", productAccount);
}

function updateProductAccount(productAccount) {
    return updateRows("PRODUCT_ACCOUNTS", productAccount);
}

function deleteProductAccount(productAccountId) {
    return deleteRows("PRODUCT_ACCOUNTS", productAccountId);
}

function locateAccountForSales() {
    return locateRows("LOCATE_ACCOUNT_SALES");
}

function locateAccountForPurchases() {
    return locateRows("LOCATE_ACCOUNT_PURCHASES");
}

function getHSCodes(query) {
    return getRows("HS_CODES", JSON.stringify(query));
}

function getProductIncludedProductsFunctions() {
    return {
        getProductIncludedProduct,
        insertProductIncludedProduct,
        updateProductIncludedProduct,
        deleteProductIncludedProduct,
        locateProduct,
    };
}

function getProductIncludedProduct(productId) {
    return getRows("PRODUCT_INCLUEDED_PRODUCTS", productId);
}

function insertProductIncludedProduct(includedProduct) {
    return addRows("PRODUCT_INCLUEDED_PRODUCTS", includedProduct);
}

function updateProductIncludedProduct(includedProduct) {
    return updateRows("PRODUCT_INCLUEDED_PRODUCTS", includedProduct);
}

function deleteProductIncludedProduct(includedProductId) {
    return deleteRows("PRODUCT_INCLUEDED_PRODUCTS", includedProductId);
}

// Transfer between warehouses: Minimum stock

function getTransferBetweenWarehousesMinimumStockFunctions() {
    return {
        getTransferBetweenWarehousesMinimumStock,
        insertTransferBetweenWarehousesMinimumStock,
        updateTransferBetweenWarehousesMinimumStock,
        deleteTransferBetweenWarehousesMinimumStock,
        generateTransferBetweenWarehousesForMinimumStock,
        getWarehouses,
    };
}

function getTransferBetweenWarehousesMinimumStock(productId) {
    return getRows("TRANSFER_BETWEEN_WAREHOUSES_MINIMUM_STOCK", productId);
}

function insertTransferBetweenWarehousesMinimumStock(data) {
    return addRows("TRANSFER_BETWEEN_WAREHOUSES_MINIMUM_STOCK", data);
}

function updateTransferBetweenWarehousesMinimumStock(data) {
    return updateRows("TRANSFER_BETWEEN_WAREHOUSES_MINIMUM_STOCK", data);
}

function deleteTransferBetweenWarehousesMinimumStock(dataId) {
    return deleteRows("TRANSFER_BETWEEN_WAREHOUSES_MINIMUM_STOCK", dataId);
}

function generateTransferBetweenWarehousesForMinimumStock() {
    return executeAction("TRANSFER_BETWEEN_WAREHOUSES_MINIMUM_STOCK");
}

/* PRODUCT MANAGER */

function tabDeprecatedProducts() {
    ReactDOM.render(
        <DeprecatedProducts
            {...(getProductManagerDeprecatedProductFunctions())}
        />,
        document.getElementById('renderTab'));
}

function getProductManagerDeprecatedProductFunctions() {
    return {
        searchDeprecatedProducts,
        insertDeprecatedProduct,
        dropDeprecatedProduct,
        deleteDeprecatedProduct,
        getDeprecatedProductCheckList,
        insertDeprecatedProductCheckList,
        toggleDeprecatedProductCheckList,
        deleteDeprecatedProductCheckList,
        movePositionDeprecatedProductCheckList,
        calcDeprecatedProductUses,
        locateProduct,
        tabDeprecatedProducts
    };
}

function searchDeprecatedProducts(query) {
    return getRows("DEPRECATED_PRODUCTS", query);
}

function insertDeprecatedProduct(deprecatedProduct) {
    return addRows("DEPRECATED_PRODUCT", deprecatedProduct);
}

function dropDeprecatedProduct(deprecatedProductId) {
    return executeAction("DROP_DEPRECATED_PRODUCT", deprecatedProductId);
}

function deleteDeprecatedProduct(deprecatedProductId) {
    return deleteRows("DEPRECATED_PRODUCT", deprecatedProductId);
}

function getDeprecatedProductCheckList(deprecatedProductId) {
    return getRows("DEPRECATED_PRODUCTS_CHECK_LIST", deprecatedProductId);
}

function insertDeprecatedProductCheckList(checkList) {
    return addRows("DEPRECATED_PRODUCT_CHECK_LIST", checkList);
}

function toggleDeprecatedProductCheckList(checkListId) {
    return executeAction("TOGGLE_DEPRECATED_PRODUCT_CHECK_LIST", checkListId);
}

function deleteDeprecatedProductCheckList(checkListId) {
    return deleteRows("DEPRECATED_PRODUCT_CHECK_LIST", checkListId);
}

function movePositionDeprecatedProductCheckList(data) {
    return executeAction("MOVE_DEPRECATED_PRODUCT_CHECK_LIST_POSITION", JSON.stringify(data));
}

function calcDeprecatedProductUses(deprecatedProductId) {
    return executeAction("CALCULATE_DEPRECATED_PRODUCT_USES", deprecatedProductId);
}

/* COUNTRIES */

function tabCountries() {
    ReactDOM.render(
        <Countries
            getCountries={getCountries}
            searchCountries={searchCountries}
            addCountry={addCountry}
            updateCountry={updateCountry}
            deleteCountry={deleteCountry}
            findLanguagesByName={findLanguagesByName}
            findCurrencyByName={findCurrencyByName}
        />,
        document.getElementById('renderTab'));
}

function getCountries() {
    return getRows("COUNTRY");
}

function searchCountries(search) {
    return searchRows("COUNTRY", search);
}

function findLanguagesByName(languageName) {
    return nameRecord("LANGUAGE", languageName);
}

function findCurrencyByName(currencyName) {
    return nameRecord("CURRENCY", currencyName);
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

/* STATES */

function tabStates() {
    ReactDOM.render(
        <States
            findCountryByName={findCountryByName}
            searchStates={searchStates}
            getStates={getStates}
            addStates={addStates}
            updateStates={updateStates}
            deleteStates={deleteStates}
        />,
        document.getElementById('renderTab'));
}

function findCountryByName(countryName) {
    console.log("findCountryByName");
    return nameRecord("COUNTRY", countryName);
}

function getStates() {
    return getRows("STATE");
}

function searchStates(search) {
    return searchRows("STATE", search);
}

function addStates(city) {
    return addRows("STATE", city);
}

function updateStates(city) {
    return updateRows("STATE", city);
}

function deleteStates(cityId) {
    return deleteRows("STATE", cityId);
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
            findStateByName={findStateByName}
            findCountryByName={findCountryByName}
            findSupplierByName={findSupplierByName}
            locateCustomers={locateCustomers}
            locateSuppliers={locateSuppliers}

            getAddresses={getAddresses}
            searchSAddress={searchSAddress}
            addAddress={addAddress}
            updateAddress={updateAddress}
            deleteAddress={deleteAddress}
        />,
        document.getElementById('renderTab'));
}

function getAddressesFunctions() {
    return {
        findCustomerByName,
        findStateByName,
        findCountryByName,
        findSupplierByName,
        locateCustomers,
        locateSuppliers,
        addAddress,
        updateAddress,
        deleteAddress,
        getAddressRow
    }
}

function getAddressRow(addressId) {
    return getRows("ADDRESS_ROW", addressId);
}

function findCustomerByName(customerName) {
    return nameRecord("CUSTOMER", customerName);
}

function findSupplierByName(supplierName) {
    return nameRecord("SUPPLIER", supplierName);
}

function findStateByName(countryId, cityName) {
    return nameRecord("STATE", JSON.stringify({ countryId, cityName }));
}

function getAddresses(query) {
    return getRows("ADDRESS", JSON.stringify(query));
}

function searchSAddress(search) {
    return searchRows("ADDRESS", JSON.stringify(search));
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
            updateCurrencyExchange={updateCurrencyExchange}
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

function updateCurrencyExchange() {
    return executeAction("UPDATE_CURRENCY_DATA");
}

/* PAYMENT METHOD */

function tabPaymentMethod() {
    ReactDOM.render(
        <PaymentMethods
            getPaymentMethod={getPaymentMethod}
            addPaymentMehod={addPaymentMehod}
            updatePaymentMethod={updatePaymentMethod}
            deletePaymentMethod={deletePaymentMethod}
            locateAccountForBanks={locateAccountForBanks}
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

function locateAccountForBanks() {
    return locateRows("LOCATE_ACCOUNT_BANKS");
}

/* LANGUAGES */

function tabLanguages() {
    ReactDOM.render(
        <Languages
            getLanguages={getLanguages}
            searchLanguages={searchLanguages}
            addLanguages={addLanguages}
            updateLanguages={updateLanguages}
            deleteLanguages={deleteLanguages}
        />,
        document.getElementById('renderTab'));
}

function getLanguages() {
    return getRows("LANGUAGE");
}

function searchLanguages(search) {
    return searchRows("LANGUAGE", search);
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
            findProductByName={findProductByName}
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
    return fetch(window.location.protocol + "//" + window.location.hostname + ":12279/document?uuid=" + uuid + "&token=" + token, { method: "POST", body: file });
}

function grantDocumentAccessToken() {
    return executeAction("GRANT_DOCUMENT_ACCESS_TOKEN");
}

function deleteDocuments(documentsId) {
    return deleteRows("DOCUMENT", documentsId);
}

function getDocumenetFunctions() {
    return {
        getDocuments,
        addDocuments,
        deleteDocuments,
        uploadDocument,
        grantDocumentAccessToken,
        locateDocumentContainers
    };
}

/* CUSTOM FIELDS */

function getCustomFieldsFunctions() {
    return {
        getCustomFields,
        insertCustomFields,
        updateCustomFields,
        deleteCustomFields
    }
}

function getCustomFields(query) {
    return getRows("CUSTOM_FIELDS", JSON.stringify(query));
}

function insertCustomFields(field) {
    return addRows("CUSTOM_FIELDS", field);
}

function updateCustomFields(field) {
    return updateRows("CUSTOM_FIELDS", field);
}

function deleteCustomFields(fieldId) {
    return deleteRows("CUSTOM_FIELDS", fieldId);
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
            tabWarehouses={tabWarehouses}
            regenerateDraggedStock={regenerateDraggedStock}
            regenerateProductStock={regenerateProductStock}
            getWarehouseMovementFunctions={getWarehouseMovementFunctions}
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

function getWarehouseMovementsByWarehouse(query) {
    return getRows("WAREHOUSE_WAREHOUSE_MOVEMENTS", JSON.stringify(query));
}

function regenerateDraggedStock(warehouseId) {
    return executeAction("REGENERATE_DRAGGED_STOCK", warehouseId);
}

function regenerateProductStock() {
    return executeAction("REGENERATE_PRODUCT_STOCK");
}

/* WAREHOUSE MOVEMENTS */

function tabWarehouseMovements() {
    ReactDOM.render(
        <WarehouseMovements
            getWarehouseMovements={getWarehouseMovements}
            addWarehouseMovements={addWarehouseMovements}
            deleteWarehouseMovements={deleteWarehouseMovements}
            findProductByName={findProductByName}
            getWarehouses={getWarehouses}
            searchWarehouseMovements={searchWarehouseMovements}
            locateProduct={locateProduct}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            getWarehouseMovementRelations={getWarehouseMovementRelations}
            getManufacturingOrdersFunctions={getManufacturingOrdersFunctions}
            getComplexManufacturingOrerFunctions={getComplexManufacturingOrerFunctions}
            getWarehouseMovementRelations={getWarehouseMovementRelations}
        />,
        document.getElementById('renderTab'));
}

function getWarehouseMovementFunctions() {
    return {
        getWarehouseMovements,
        addWarehouseMovements,
        deleteWarehouseMovements,
        findProductByName,
        getWarehouses,
        searchWarehouseMovements,
        locateProduct,
        getRegisterTransactionalLogs,
        getWarehouseMovementRelations,
        getManufacturingOrdersFunctions,
        getComplexManufacturingOrerFunctions,
        getWarehouseMovementRelations,
    }
}

function getWarehouseMovements(query) {
    return getRows("WAREHOUSE_MOVEMENTS", JSON.stringify(query));
}

function searchWarehouseMovements(search) {
    return searchRows("WAREHOUSE_MOVEMENT", JSON.stringify(search));
}

function addWarehouseMovements(movement) {
    return addRows("WAREHOUSE_MOVEMENTS", movement);
}

function deleteWarehouseMovements(movementId) {
    return deleteRows("WAREHOUSE_MOVEMENTS", movementId);
}

function getWarehouseMovementRelations(movementId) {
    return getRows("WAREHOUSE_MOVEMENT_RELATIONS", movementId);
}

/* INVENTORY */

function tabInventory() {
    ReactDOM.render(
        <Inventory
            getInventories={getInventories}
            insertInventory={insertInventory}
            deleteInventory={deleteInventory}
            finishInventory={finishInventory}
            getInventoryProducts={getInventoryProducts}
            insertUpdateDeleteInventoryProducts={insertUpdateDeleteInventoryProducts}
            getWarehouses={getWarehouses}
            locateProduct={locateProduct}
            locateProductFamilies={locateProductFamilies}
            insertProductFamilyInventoryProducts={insertProductFamilyInventoryProducts}
            insertAllProductsInventoryProducts={insertAllProductsInventoryProducts}
            deleteAllProductsInventoryProducts={deleteAllProductsInventoryProducts}
            tabInventory={tabInventory}
            insertOrCountInventoryProductsByBarcode={insertOrCountInventoryProductsByBarcode}
        />,
        document.getElementById('renderTab'));
}

function getInventories() {
    return getRows("INVENTORY");
}

function insertInventory(inventory) {
    return addRows("INVENTORY", inventory);
}

function deleteInventory(inventoryId) {
    return deleteRows("INVENTORY", inventoryId);
}

function finishInventory(inventory) {
    return executeAction("FINISH_INVENTORY", JSON.stringify(inventory));
}

function getInventoryProducts(inventoryId) {
    return getRows("INVENTORY_PODUCTS", inventoryId);
}

function insertUpdateDeleteInventoryProducts(input) {
    return executeAction("INSERT_UPDATE_DELETE_INVENTORY_PRODUCTS", JSON.stringify(input));
}

function insertProductFamilyInventoryProducts(input) {
    return executeAction("INSERT_PRODUCT_FAMILY_INVENTORY_PRODUCTS", JSON.stringify(input));
}

function insertAllProductsInventoryProducts(input) {
    return executeAction("INSERT_ALL_PRODUCTS_INVENTORY_PRODUCTS", JSON.stringify(input));
}

function deleteAllProductsInventoryProducts(input) {
    return executeAction("DELETE_ALL_PRODUCTS_INVENTORY_PRODUCTS", JSON.stringify(input));
}

function insertOrCountInventoryProductsByBarcode(input) {
    return executeAction("INSERT_OR_COUNT_INVENTORY_PRODUCTS_BY_BARCODE", JSON.stringify(input));
}

/* TRANSFER BETWEEN WAREHOUSES */

function tabTransferBetweenWarehouses() {
    ReactDOM.render(<TransferBetweenWarehousesMenu
        searchTransferBetweenWarehouses={searchTransferBetweenWarehouses}
        insertTransferBetweenWarehouses={insertTransferBetweenWarehouses}
        deleteTransferBetweenWarehouses={deleteTransferBetweenWarehouses}
        getTransferBetweenWarehousesDetail={getTransferBetweenWarehousesDetail}
        insertTransferBetweenWarehousesDetail={insertTransferBetweenWarehousesDetail}
        deleteTransferBetweenWarehousesDetail={deleteTransferBetweenWarehousesDetail}
        transferBetweenWarehousesDetailBarCode={transferBetweenWarehousesDetailBarCode}
        transferBetweenWarehousesDetailQuantity={transferBetweenWarehousesDetailQuantity}
        getTransferBetweenWarehousesWarehouseMovements={getTransferBetweenWarehousesWarehouseMovements}
        getWarehouses={getWarehouses}
        locateProduct={locateProduct}
        tabTransferBetweenWarehouses={tabTransferBetweenWarehouses}
    />, document.getElementById('renderTab'));
}

function searchTransferBetweenWarehouses(query) {
    return getRows("TRANSFER_BETWEEN_WAREHOUSES", JSON.stringify(query));
}

function insertTransferBetweenWarehouses(transfer) {
    return addRows("TRANSFER_BETWEEN_WAREHOUSES", transfer);
}

function deleteTransferBetweenWarehouses(transferId) {
    return deleteRows("TRANSFER_BETWEEN_WAREHOUSES", transferId);
}

function getTransferBetweenWarehousesDetail(transferBetweenWarehousesId) {
    return getRows("TRANSFER_BETWEEN_WAREHOUSES_DETAIL", transferBetweenWarehousesId);
}

function insertTransferBetweenWarehousesDetail(detail) {
    return addRows("TRANSFER_BETWEEN_WAREHOUSES_DETAIL", detail);
}

function deleteTransferBetweenWarehousesDetail(detailId) {
    return deleteRows("TRANSFER_BETWEEN_WAREHOUSES_DETAIL", detailId);
}

function transferBetweenWarehousesDetailBarCode(query) {
    return executeAction("TRANSFER_BETWEEN_WAREHOUSES_DETAIL_BARCODE", JSON.stringify(query));
}

function transferBetweenWarehousesDetailQuantity(query) {
    return executeAction("TRANSFER_BETWEEN_WAREHOUSES_DETAIL_QUANTITY", JSON.stringify(query));
}

function getTransferBetweenWarehousesWarehouseMovements(transferId) {
    return getRows("TRANSFER_BETWEEN_WAREHOUSES_WAREHOUSE_MOVEMENTS", transferId);
}

/* MANUFACTURING ORDERS */

function tabManufacturingOrders() {
    ReactDOM.render(
        <ManufacturingOrders
            getManufacturingOrderTypes={getManufacturingOrderTypes}
            getManufacturingOrders={getManufacturingOrders}
            addManufacturingOrder={addManufacturingOrder}
            addMultipleManufacturingOrder={addMultipleManufacturingOrder}
            updateManufacturingOrder={updateManufacturingOrder}
            deleteManufacturingOrder={deleteManufacturingOrder}
            findProductByName={findProductByName}
            toggleManufactuedManufacturingOrder={toggleManufactuedManufacturingOrder}
            manufacturingOrderTagPrinted={manufacturingOrderTagPrinted}
            locateProduct={locateProduct}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            getWarehouses={getWarehouses}
        />,
        document.getElementById('renderTab'));
}

function getManufacturingOrdersFunctions() {
    return {
        getManufacturingOrderTypes,
        addManufacturingOrder,
        addMultipleManufacturingOrder,
        updateManufacturingOrder,
        deleteManufacturingOrder,
        findProductByName,
        toggleManufactuedManufacturingOrder,
        manufacturingOrderTagPrinted,
        locateProduct,
        getRegisterTransactionalLogs,
        getWarehouses,
    };
}

function getManufacturingOrders(orderTypeId) {
    return getRows("MANUFACTURING_ORDER", JSON.stringify(orderTypeId));
}

function addManufacturingOrder(order) {
    return addRows("MANUFACTURING_ORDER", order);
}

function addMultipleManufacturingOrder(order) {
    return addRows("MULTIPLE_MANUFACTURING_ORDER", order);
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

function manufacturingOrderTagPrinted(orderId) {
    return executeAction("MANUFACTURING_ORDER_TAG_PRINTED", orderId);
}

/* MANUFACTURING ORDER TYPES */

function tabManufacturingOrderTypes() {
    ReactDOM.render(
        <ManufacturingOrderTypes
            getManufacturingOrderTypes={getManufacturingOrderTypes}
            addManufacturingOrderTypes={addManufacturingOrderTypes}
            updateManufacturingOrderTypes={updateManufacturingOrderTypes}
            deleteManufacturingOrderTypes={deleteManufacturingOrderTypes}

            getManufacturingOrderTypeComponents={getManufacturingOrderTypeComponents}
            insertManufacturingOrderTypeComponents={insertManufacturingOrderTypeComponents}
            updateManufacturingOrderTypeComponents={updateManufacturingOrderTypeComponents}
            deleteManufacturingOrderTypeComponents={deleteManufacturingOrderTypeComponents}
            locateProduct={locateProduct}
            getProductsByManufacturingOrderType={getProductsByManufacturingOrderType}
            getProductFunctions={getProductFunctions}
        />,
        document.getElementById('renderTab'));
}

function getManufacturingOrderTypeFunctions() {
    return {
        getManufacturingOrderTypes,
        addManufacturingOrderTypes,
        updateManufacturingOrderTypes,
        deleteManufacturingOrderTypes,
        getManufacturingOrderTypeComponents,
        insertManufacturingOrderTypeComponents,
        updateManufacturingOrderTypeComponents,
        deleteManufacturingOrderTypeComponents,
        locateProduct,
        getProductsByManufacturingOrderType,
        getProductFunctions,
    }
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

function getManufacturingOrderTypeComponents(typeId) {
    return getRows("MANUFACTURING_ORDER_TYPE_COMPONENTS", typeId);
}

function insertManufacturingOrderTypeComponents(component) {
    return addRows("MANUFACTURING_ORDER_TYPE_COMPONENTS", component);
}

function updateManufacturingOrderTypeComponents(component) {
    return updateRows("MANUFACTURING_ORDER_TYPE_COMPONENTS", component);
}

function deleteManufacturingOrderTypeComponents(componentId) {
    return deleteRows("MANUFACTURING_ORDER_TYPE_COMPONENTS", componentId);
}

function getProductsByManufacturingOrderType(typeId) {
    return getRows("MANUFACTURING_ORDER_TYPE_PRODUCTS", typeId);
}

/* COMPLEX MANUFACTURING ORDERS */

function tabComplexManufacturingOrders() {
    ReactDOM.render(
        <ComplexManufacturingOrders
            getManufacturingOrderTypes={getManufacturingOrderTypes}
            getComplexManufacturingOrder={getComplexManufacturingOrder}
            insertComplexManufacturingOrder={insertComplexManufacturingOrder}
            insertMultipleComplexManufacturingOrders={insertMultipleComplexManufacturingOrders}
            deleteComplexManufacturingOrder={deleteComplexManufacturingOrder}
            toggleManufactuedComplexManufacturingOrder={toggleManufactuedComplexManufacturingOrder}
            getComplexManufacturingOrderManufacturingOrder={getComplexManufacturingOrderManufacturingOrder}
            getComplexManufacturingOrderManufacturingOrder={getComplexManufacturingOrderManufacturingOrder}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            complexManufacturingOrderTagPrinted={complexManufacturingOrderTagPrinted}
            getWarehouses={getWarehouses}
        />,
        document.getElementById('renderTab'));
}

function getComplexManufacturingOrerFunctions() {
    return {
        getManufacturingOrderTypes,
        getComplexManufacturingOrder,
        insertComplexManufacturingOrder,
        insertMultipleComplexManufacturingOrders,
        deleteComplexManufacturingOrder,
        toggleManufactuedComplexManufacturingOrder,
        getComplexManufacturingOrderManufacturingOrder,
        getRegisterTransactionalLogs,
        complexManufacturingOrderTagPrinted,
        getWarehouses,
    };
}

function getComplexManufacturingOrder(query) {
    return getRows("COMPLEX_MANUFACTURING_ORDER", JSON.stringify(query));
}

function insertComplexManufacturingOrder(order) {
    return addRows("COMPLEX_MANUFACTURING_ORDER", order);
}

function insertMultipleComplexManufacturingOrders(order) {
    return addRows("MULTIPLE_COMPLEX_MANUFACTURING_ORDER", order);
}

function deleteComplexManufacturingOrder(orderId) {
    return deleteRows("COMPLEX_MANUFACTURING_ORDER", orderId);
}

function toggleManufactuedComplexManufacturingOrder(orderId) {
    return executeAction("TOGGLE_COMPLEX_MANUFACTURING_ORDER", orderId);
}

function getComplexManufacturingOrderManufacturingOrder(orderId) {
    return getRows("COMPLEX_MANUFACTURING_ORDER_MANUFACTURING_ORDER", orderId);
}

function complexManufacturingOrderTagPrinted(orderId) {
    return executeAction("COMPLEX_MANUFACTURING_ORDER_TAG_PRINTED", orderId);
}

/* PACKAGING */

function tabPackaging() {
    ReactDOM.render(
        <PackagingMenu
            getSalesOrderPreparation={getSalesOrderPreparation}
            getSalesOrderAwaitingShipping={getSalesOrderAwaitingShipping}
            getSalesOrderDetails={getSalesOrderDetails}
            getPackages={getPackages}
            getSalesOrderPackaging={getSalesOrderPackaging}
            addSalesOrderPackaging={addSalesOrderPackaging}
            addSalesOrderDetailPackaged={addSalesOrderDetailPackaged}
            addSalesOrderDetailPackagedEan13={addSalesOrderDetailPackagedEan13}
            deleteSalesOrderDetailPackaged={deleteSalesOrderDetailPackaged}
            deletePackaging={deletePackaging}
            tabPackaging={tabPackaging}
            generateShipping={generateShipping}
            getSalesOrderPallets={getSalesOrderPallets}
            insertPallet={insertPallet}
            updatePallet={updatePallet}
            deletePallet={deletePallet}
            getProductRow={getProductRow}
            grantDocumentAccessToken={grantDocumentAccessToken}
            transferBetweenWarehousesToSentToPreparationOrders={transferBetweenWarehousesToSentToPreparationOrders}
            getWarehouses={getWarehouses}
            getShippingFunctions={getShippingFunctions}
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

function getSalesOrderPallets(orderId) {
    return getRows("PALLETS", orderId);
}

function insertPallet(pallet) {
    return addRows("PALLET", pallet);
}

function updatePallet(pallet) {
    return updateRows("PALLET", pallet);
}

function deletePallet(palletId) {
    return deleteRows("PALLET", palletId);
}

function transferBetweenWarehousesToSentToPreparationOrders(transferData) {
    return executeAction("TRANSFER_BETWEEN_WAREHOUSES_DETAIL_SENT_TO_PREPARATION", JSON.stringify(transferData));
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
            locateSaleDeliveryNote={locateSaleDeliveryNote}
            tabShipping={tabShipping}
            toggleShippingSent={toggleShippingSent}
            documentFunctions={getDocumenetFunctions()}
            getIncoterms={getIncoterms}
            getShippingTags={getShippingTags}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            getShippingStatusHistory={getShippingStatusHistory}
        />,
        document.getElementById('renderTab'));
}

function getShippingFunctions() {
    return {
        getShippingPackaging,
        addShipping,
        updateShipping,
        deleteShipping,
        locateAddress: locateAddressByCustomer,
        findCarrierByName,
        locateSaleOrder,
        locateSaleDeliveryNote,
        tabShipping,
        toggleShippingSent,
        documentFunctions: getDocumenetFunctions(),
        getIncoterms,
        getShippingTags,
        getRegisterTransactionalLogs,
        getShippingStatusHistory
    }
}

function getShippings() {
    return getRows("SHIPPINGS");
}

function searchShippings(search) {
    return searchRows("SHIPPING", JSON.stringify(search));
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

function locateSaleOrder(query) {
    return locateRows("SALE_ORDER", JSON.stringify(query));
}

function locateSaleDeliveryNote(orderId) {
    return locateRows("SALE_DELIVERY_NOTE", orderId);
}

function toggleShippingSent(shippingId) {
    return executeAction("TOGGLE_SHIPPING_SENT", shippingId);
}

function getShippingTags(shippingId) {
    return getRows("SHIPPING_TAGS", shippingId);
}

function getShippingStatusHistory(shippingId) {
    return getRows("SHIPPING_STATUS_HISTORY", shippingId);
}

/* COLLECT SHIPPINGS */

function tabCollectShipping() {
    ReactDOM.render(
        <CollectShippings
            getShippings={getShippingsCollect}
            setShippingCollected={setShippingCollected}
        />,
        document.getElementById('renderTab'));
}

function getShippingsCollect() {
    return getRows("SHIPPING_NOT_COLLECTED");
}

function setShippingCollected(shippings) {
    return executeAction("SET_SHIPPING_COLLECTED", JSON.stringify(shippings));
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
            evaluatePasswordSecureCloud={evaluatePasswordSecureCloud}
            registerUserInGoogleAuthenticator={registerUserInGoogleAuthenticator}
            removeUserFromGoogleAuthenticator={removeUserFromGoogleAuthenticator}
            getConnectionFilterUserByUser={getConnectionFilterUserByUser}
            getConnectionFilters={getConnectionFilters}
            insertConnectionFilterUser={insertConnectionFilterUser}
            deleteConnectionFilterUser={deleteConnectionFilterUser}
            deleteLoginTokensFromUser={deleteLoginTokensFromUser}
        />,
        document.getElementById('renderTab'));
}

function getUsers(searchText = "") {
    return getRows("USERS", searchText);
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

function evaluatePasswordSecureCloud(password) {
    return executeAction("EVALUATE_PASSWORD_SECURE_CLOUD", password);
}

function registerUserInGoogleAuthenticator(userId) {
    return executeAction("REGISTER_USER_IN_GOOGLE_AUTHENTICATOR", userId);
}

function removeUserFromGoogleAuthenticator(userId) {
    return executeAction("REMOVE_USER_IN_GOOGLE_AUTHENTICATOR", userId);
}

function getConnectionFilterUserByUser(userId) {
    return getRows("CONNECTION_FILTER_USERS_BY_USER", userId);
}

function deleteLoginTokensFromUser(userId) {
    return executeAction("DELETE_LOGIN_TOKENS_FROM_USER", userId);
}

/* GROUPS */

function tabGroups() {
    ReactDOM.render(
        <Groups
            getGroups={getGroups}
            addGroup={addGroup}
            updateGroup={updateGroup}
            deleteGroup={deleteGroup}
            getGroupPermissionDictionary={getGroupPermissionDictionary}
            insertPermissionDictionaryGroup={insertPermissionDictionaryGroup}
            deletePermissionDictionaryGroup={deletePermissionDictionaryGroup}
            getGroupUsers={getGroupUsers}
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

function getGroupPermissionDictionary(groupId) {
    return getRows("GROUP_PERMISSION_DICTIONARY", groupId);
}

function insertPermissionDictionaryGroup(permissionGroup) {
    return addRows("PERMISSION_DICTIONARY_GROUP", permissionGroup);
}

function deletePermissionDictionaryGroup(permissionGroup) {
    return deleteRows("PERMISSION_DICTIONARY_GROUP", JSON.stringify(permissionGroup));
}

function getGroupUsers(groupId) {
    return getRows("GET_GROUP_USERS", groupId);
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

            getConfigAccountsVat={getConfigAccountsVat}
            insertConfigAccountsVat={insertConfigAccountsVat}
            deleteConfigAccountsVat={deleteConfigAccountsVat}
            getEnterpriseLogo={getEnterpriseLogo}
            setEnterpriseLogo={setEnterpriseLogo}
            deleteEnterpriseLogo={deleteEnterpriseLogo}
            getLabelPrinterProfiles={getLabelPrinterProfiles}
            insertLabelPrinterProfile={insertLabelPrinterProfile}
            updateLabelPrinterProfile={updateLabelPrinterProfile}
            deleteLabelPrinterProfile={deleteLabelPrinterProfile}
        />,
        document.getElementById('renderTab'));
}

function getSettings() {
    return getRows("SETTINGS");
}

function getClientSettings() {
    return getRows("CLIENT_SETTINGS");
}

function updateSettings(settings) {
    return updateRows("SETTINGS", settings);
}

function tabPrestaShopZones() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <PrestaShopZones
            getPrestaShopZones={getPrestaShopZones}
            updatePrestaShopZones={updatePrestaShopZones}
        />,
        document.getElementById('renderTab'));
}

function getPrestaShopZones() {
    return getRows("PS_ZONES");
}

function updatePrestaShopZones(zone) {
    return updateRows("PS_ZONES", zone);
}

function importFromPrestaShop() {
    return executeAction("PRESTASHOP");
}

function importFromWooCommerce() {
    return executeAction("WOOCOMMERCE");
}

function importFromShopify() {
    return executeAction("SHOPIFY");
}

function getConfigAccountsVat() {
    return getRows("CONFIG_ACCOUNTS_VAT");
}

function insertConfigAccountsVat(configVat) {
    return addRows("CONFIG_ACCOUNTS_VAT", configVat);
}

function deleteConfigAccountsVat(configVatId) {
    return deleteRows("CONFIG_ACCOUNTS_VAT", configVatId);
}

function getEnterpriseLogo() {
    return executeAction("GET_ENTERPRISE_LOGO");
}

function setEnterpriseLogo(base64) {
    return executeAction("SET_ENTERPRISE_LOGO", JSON.stringify({ base64 }));
}

function deleteEnterpriseLogo() {
    return executeAction("DELETE_ENTERPRISE_LOGO");
}

function getLabelPrinterProfiles() {
    return getRows("LABEL_PRINTER_PROFILES");
}

function insertLabelPrinterProfile(labelPrinerProfile) {
    return addRows("LABEL_PRINTER_PROFILE", labelPrinerProfile);
}

function updateLabelPrinterProfile(labelPrinerProfile) {
    return updateRows("LABEL_PRINTER_PROFILE", labelPrinerProfile);
}

function deleteLabelPrinterProfile(labelPrinerProfileId) {
    return deleteRows("LABEL_PRINTER_PROFILE", labelPrinerProfileId);
}

/* CONNECTIONS */

function tabConnections() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <Connections
            getConnections={getConnections}
            disconnectConnection={disconnectConnection}
        />,
        document.getElementById('renderTab'));
}

function getConnections() {
    return getRows("CONNECTIONS");
}

function disconnectConnection(id) {
    return executeAction("DISCONNECT", id);
}

/* PERMISSION DICTIONARY */

function tabPermissionDictionary() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <PermissionDictionary
            getPermissionDictionary={getPermissionDictionary}
            getGroupsPermissionDictionary={getGroupsPermissionDictionary}
        />,
        document.getElementById('renderTab'));
}

function getPermissionDictionary() {
    return getRows("PERMISSION_DICTIONARY");
}

function getGroupsPermissionDictionary(permissionKey) {
    return getRows("PERMISSION_DICTIONARY_GRUPS", permissionKey);
}

/* DANGEROUS */

function deleteAllLoginTokens() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <ConfirmQuestion
            modalTitle={i18next.t('CONFIRM-DANGEROUS-ACTION')}
            modalText={i18next.t('you-are-abount-to-delete-all-the-saved-logins-so-all-the-users-desc')}
            modalButtonText={i18next.t('run')}
            onConfirm={() => {
                executeAction("DELETE_ALL_LOGIN_TOKENS");
            }}
        />,
        document.getElementById('renderTab'));
}

function disconnectAllConnections() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <ConfirmQuestion
            modalTitle={i18next.t('CONFIRM-DANGEROUS-ACTION')}
            modalText={i18next.t('you-are-abount-to-disconnect-everybody-in-the-company-desc')}
            modalButtonText={i18next.t('run')}
            onConfirm={() => {
                executeAction("DISCONNECT_EVERYBODY");
            }}
        />,
        document.getElementById('renderTab'));
}

function forceAllUsersToChangePassowrds() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <ConfirmQuestion
            modalTitle={i18next.t('CONFIRM-DANGEROUS-ACTION')}
            modalText={i18next.t('this-option-will-force-all-users-to-change-their-passwords-the-next-time-desc')}
            modalButtonText={i18next.t('run')}
            onConfirm={() => {
                executeAction("FORCE_ALL_USERS_TO_CHANGE_PASSWORDS");
            }}
        />,
        document.getElementById('renderTab'));
}

function regenerateDraggedStockAllWarehouses() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <ConfirmQuestion
            modalTitle={i18next.t('CONFIRM-DANGEROUS-ACTION')}
            modalText={i18next.t('you-are-abount-to-regenerate-the-dragged-stock-for-all-the-warehouses-desc')}
            modalButtonText={i18next.t('run')}
            onConfirm={() => {
                executeAction("REGENERATE_DRAGGED_STOCK_ALL_WAREHOUSES");
            }}
        />,
        document.getElementById('renderTab'));
}

function regenerateStockRecords() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <ConfirmQuestion
            modalTitle={i18next.t('CONFIRM-DANGEROUS-ACTION')}
            modalText={i18next.t('you-are-abount-to-regenerate-stock-records-for-all-the-products-desc')}
            modalButtonText={i18next.t('run')}
            onConfirm={() => {
                executeAction("REGENERATE_STOCK_RECORDS");
            }}
        />,
        document.getElementById('renderTab'));
}

/* ABOUT WINDOW */

function aboutWindow() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <About

        />,
        document.getElementById('renderTab'));
}

/* JOURNALS */

function tabJournals() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <Journals
            getJournals={getJournals}
            addJournal={addJournal}
            updateJournal={updateJournal}
            updateJournal={updateJournal}
            deleteJournal={deleteJournal}
        />,
        document.getElementById('renderTab'));
}

function getJournals() {
    return getRows("JOURNALS");
}

function addJournal(journal) {
    return addRows("JOURNAL", journal);
}

function updateJournal(journal) {
    return updateRows("JOURNAL", journal);
}

function deleteJournal(journalId) {
    return deleteRows("JOURNAL", journalId);
}

/* ACCOUNTS */

function tabAccounts() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <Accounts
            getAccounts={getAccounts}
            searchAccounts={searchAccounts}
            insertAccount={insertAccount}
            updateAccount={updateAccount}
            deleteAccount={deleteAccount}
            getJournals={getJournals}
        />,
        document.getElementById('renderTab'));
}

function getAccounts() {
    return getRows("ACCOUNTS");
}

function searchAccounts(search) {
    return searchRows("ACCOUNT", JSON.stringify(search));
}

function insertAccount(account) {
    return addRows("ACCOUNT", account);
}

function updateAccount(account) {
    return updateRows("ACCOUNT", account);
}

function deleteAccount(accountId) {
    return deleteRows("ACCOUNT", accountId);
}

/* REPORT 111 */

function tabReport111() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(<Report111
        execReportForm111={execReportForm111}
    />, document.getElementById('renderTab'));
}

function execReportForm111(query) {
    return getRows("REPORT_111", JSON.stringify(query));
}

/* REPORT 115 */

function tabReport115() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(<Report115
        execReportForm115={execReportForm115}
    />, document.getElementById('renderTab'));
}

function execReportForm115(query) {
    return getRows("REPORT_115", JSON.stringify(query));
}

/* INTRASTAT */

function tabIntrastat() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(<Intrastat
        intrastatReport={intrastatReport}
    />, document.getElementById('renderTab'));
};

function intrastatReport(query) {
    return executeAction("INTRASTAT", JSON.stringify(query));
};

/* INVENTORY VALUATION */

function tabInventoyValuation() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(<InventoyValuation
        getInventoyValuation={getInventoyValuation}
        locateProductFamilies={locateProductFamilies}
    />, document.getElementById('renderTab'));
}

function getInventoyValuation(query) {
    return getRows("INVENTORY_VALUATION", JSON.stringify(query));
}

/* ACCOUNTING MOVEMENTS */

function tabAccountingMovements() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <AccountingMovements
            getAccountingMovement={getAccountingMovement}
            searchAccountingMovements={searchAccountingMovements}
            insertAccountingMovement={insertAccountingMovement}
            deleteAccountingMovement={deleteAccountingMovement}
            getBillingSeries={getBillingSeries}

            getAccountingMovementDetail={getAccountingMovementDetail}
            insertAccountingMovementDetail={insertAccountingMovementDetail}
            deleteAccountingMovementDetail={deleteAccountingMovementDetail}
            tabAccountingMovements={tabAccountingMovements}
            getAccountingMovementSaleInvoices={getAccountingMovementSaleInvoices}
            getAccountingMovementPurchaseInvoices={getAccountingMovementPurchaseInvoices}
            getPaymentMethod={getPaymentMethod}
            getColletionOperations={getColletionOperations}
            insertCharges={insertCharges}
            getCharges={getCharges}
            deleteCharges={deleteCharges}
            getPaymentTransactions={getPaymentTransactions}
            insertPayment={insertPayment}
            getPayments={getPayments}
            deletePayment={deletePayment}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
            getSalesInvoicesFuntions={getSalesInvoicesFuntions}
            getPurcaseInvoicesFunctions={getPurcaseInvoicesFunctions}
            getAccounts={getAccounts}
        />,
        document.getElementById('renderTab'));
}

function getAccountingMovementsFunction() {
    return {
        insertAccountingMovement,
        deleteAccountingMovement,
        getBillingSeries,

        getAccountingMovementDetail,
        insertAccountingMovementDetail,
        deleteAccountingMovementDetail,
        getAccountingMovementSaleInvoices,
        getAccountingMovementPurchaseInvoices,
        getPaymentMethod,
        getColletionOperations,
        insertCharges,
        getCharges,
        deleteCharges,
        getPaymentTransactions,
        insertPayment,
        getPayments,
        deletePayment,
        getRegisterTransactionalLogs,
        getSalesInvoicesFuntions,
        getPurcaseInvoicesFunctions,
        getAccountingMovementRow,
        getAccounts
    }
}

function getAccountingMovement() {
    return getRows("ACCOUNTING_MOVEMENTS");
}

function searchAccountingMovements(search) {
    return searchRows("ACCOUNTING_MOVEMENTS", JSON.stringify(search));
}

function insertAccountingMovement(movement) {
    return addRows("ACCOUNTING_MOVEMENT", movement);
}

function deleteAccountingMovement(movementId) {
    return deleteRows("ACCOUNTING_MOVEMENT", movementId);
}

function getAccountingMovementDetail(movementId) {
    return getRows("ACCOUNTING_MOVEMENT_DETAILS", movementId);
}

function insertAccountingMovementDetail(detail) {
    return addRows("ACCOUNTING_MOVEMENT_DETAIL", detail);
}

function deleteAccountingMovementDetail(detailId) {
    return deleteRows("ACCOUNTING_MOVEMENT_DETAIL", detailId);
}

function getAccountingMovementSaleInvoices(movementId) {
    return getRows("ACCOUNTING_MOVEMENT_SALE_INVOICES", movementId);
}

function getAccountingMovementPurchaseInvoices(movementId) {
    return getRows("ACCOUNTING_MOVEMENT_PURCHASE_INVOICES", movementId);
}

function getColletionOperations(accountingMovement) {
    return getRows("ACCOUNTING_MOVEMENT_COLLECTION_OPERATION", accountingMovement);
}

function insertCharges(charges) {
    return addRows("CHARGES", charges);
}

function getCharges(collectionOperationId) {
    return getRows("COLLECTION_OPERATION_CHARGES", collectionOperationId);
}

function deleteCharges(chargesId) {
    return deleteRows("CHARGES", chargesId);
}

function getPaymentTransactions(accountingMovement) {
    return getRows("ACCOUNTING_MOVEMENT_PAYMENT_TRANSACTIONS", accountingMovement);
}

function insertPayment(payment) {
    return addRows("PAYMENT", payment);
}

function getPayments(collectionOperationId) {
    return getRows("PAYMENT_TRANSACTION_PAYMENTS", collectionOperationId);
}

function deletePayment(chargesId) {
    return deleteRows("PAYMENT", chargesId);
}

function getAccountingMovementRow(accountingMovementId) {
    return getRows("ACCOUNTING_MOVEMENT_ROW", accountingMovementId);
}

/* POST INVOICES */

function tabPostSalesInvoices() {
    ReactDOM.render(
        <PostSalesInvoices
            getSalesInvoices={getSalesInvoices}
            searchSalesInvoices={searchSalesInvoices}
            salesPostInvoices={salesPostInvoices}
        />,
        document.getElementById('renderTab'));
}

function salesPostInvoices(data) {
    return executeAction("SALES_POST_INVOICES", JSON.stringify(data));
}

function tabPostPurchaseInvoices() {
    ReactDOM.render(
        <PostPurchaseInvoices
            getPurchaseInvoices={getPurchaseInvoices}
            searchPurchaseInvoices={searchPurchaseInvoices}
            purchasePostInvoices={purchasePostInvoices}
        />,
        document.getElementById('renderTab'));
}

function purchasePostInvoices(data) {
    return executeAction("PURCHASE_POST_INVOICES", JSON.stringify(data));
}

/* CHARGES */

function tabCharges() {
    ReactDOM.render(
        <Charges
            getPendingColletionOperations={getPendingColletionOperations}
            searchCollectionOperations={searchCollectionOperations}
            insertCharges={insertCharges}
            getCharges={getCharges}
            deleteCharges={deleteCharges}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
        />,
        document.getElementById('renderTab'));
}

function getPendingColletionOperations() {
    return getRows("PENDING_COLLECTION_OPERATIONS");
}

function searchCollectionOperations(query) {
    return getRows("SEARCH_COLLECTION_OPERATIONS", JSON.stringify(query));
}

/* PAYMENTS */

function tabPayments() {
    ReactDOM.render(
        <Payments
            getPendingPaymentTransaction={getPendingPaymentTransaction}
            searchPaymentTransactions={searchPaymentTransactions}
            insertPayment={insertPayment}
            getPayments={getPayments}
            deletePayment={deletePayment}
            getRegisterTransactionalLogs={getRegisterTransactionalLogs}
        />,
        document.getElementById('renderTab'));
}

function getPendingPaymentTransaction() {
    return getRows("PENDING_PAYMENT_TRANSACTIONS");
}

function searchPaymentTransactions(query) {
    return getRows("SEARCH_PAYMENT_TRANSACTIONS", JSON.stringify(query));
}

/* TRIAL BALANCE */

function tabTrialBalance() {
    ReactDOM.render(<TrialBalance
        getTrialBalance={getTrialBalance}
        getJournals={getJournals}
    />, document.getElementById('renderTab'));
}

function getTrialBalance(query) {
    return getRows("TRIAL_BALANCE", JSON.stringify(query));
}

/* MONTHLY SALES AMOUNT */

function tabMonthlySalesAmount() {
    ReactDOM.render(
        <MonthlySalesAmount
            monthlySalesAmount={monthlySalesAmount}
        />,
        document.getElementById('renderTab'));
}

function monthlySalesAmount(query) {
    return getRows("MONTHLY_SALES_AMOUNT", JSON.stringify(query));
}

/* MONTHLY SALES QUANTITY */

function tabMonthlySalesQuantity() {
    ReactDOM.render(
        <MonthlySalesQuantity
            monthlySalesQuantity={monthlySalesQuantity}
        />,
        document.getElementById('renderTab'));
}

function monthlySalesQuantity(query) {
    return getRows("MONTHLY_SALES_QUANTITY", JSON.stringify(query));
}

/* SALES OF A PRODUCT QUANTITY */

function tabSalesOfAProductQuantity() {
    ReactDOM.render(
        <SalesOfAProductQuantity
            salesOfAProductQuantity={salesOfAProductQuantity}
            locateProduct={locateProduct}
        />,
        document.getElementById('renderTab'));
}

function salesOfAProductQuantity(productIds) {
    return getRows("SALES_OF_A_PRODUCT_QUANTITY", JSON.stringify(productIds));
}

/* SALES OF A PRODUCT AMOUNT */

function tabSalesOfAProductAmount() {
    ReactDOM.render(
        <SalesOfAProductAmount
            salesOfAProductAmount={salesOfAProductAmount}
            locateProduct={locateProduct}
        />,
        document.getElementById('renderTab'));
}

function salesOfAProductAmount(productIds) {
    return getRows("SALES_OF_A_PRODUCT_AMOUNT", JSON.stringify(productIds));
}

/* DAYS OF SERVICE SALE ORDERS */

function tabDaysOfServiceSaleOrders() {
    ReactDOM.render(
        <DaysOfServiceSaleOrders
            daysOfServiceSaleOrders={daysOfServiceSaleOrders}
        />,
        document.getElementById('renderTab'));
}

function daysOfServiceSaleOrders(year) {
    return getRows("DAYS_OF_SERVICE_SALE_ORDERS", year);
}

/* DAYS OF SERVICE PURCHASE ORDERS */

function tabDaysOfServicePurchaseOrders() {
    ReactDOM.render(
        <DaysOfServicePurchaseOrders
            daysOfServicePurchaseOrders={daysOfServicePurchaseOrders}
        />,
        document.getElementById('renderTab'));
}

function daysOfServicePurchaseOrders(year) {
    return getRows("DAYS_OF_SERVICE_PURCHASE_ORDERS", year);
}

/* MONTHLY PURCHASES QUANTITY */

function tabMonthlyPurchaseAmount() {
    ReactDOM.render(
        <MonthlyPurchaseAmount
            purchaseOrdersByMonthAmount={purchaseOrdersByMonthAmount}
        />,
        document.getElementById('renderTab'));
}

function purchaseOrdersByMonthAmount(query) {
    return getRows("PURCHASE_ORDERS_BY_MONTH_AMOUNT", JSON.stringify(query));
}

/* PAYMENT METHODS OF THE SALE ORDERS */

function tabPaymentMethodsSaleOrdersQuantity() {
    ReactDOM.render(
        <PaymentMethodsSaleOrdersQuantity
            paymentMethodsSaleOrdersAmount={paymentMethodsSaleOrdersAmount}
        />,
        document.getElementById('renderTab'));
}

function paymentMethodsSaleOrdersAmount(query) {
    return getRows("PAYMENT_METHODS_SALE_ORDERS_AMOUNT", JSON.stringify(query));
}

/* SALE ORDERS BY COUNTRY */

function tabCountriesSaleOrdersAmount() {
    ReactDOM.render(
        <CountriesSaleOrdersAmount
            countriesSaleOrdersAmount={countriesSaleOrdersAmount}
        />,
        document.getElementById('renderTab'));
}

function countriesSaleOrdersAmount(query) {
    return getRows("COUNTRIES_SALES_ORDERS_AMOUNT", JSON.stringify(query));
}

/* BENEFITS */

function tabStatisticsBenefits() {
    ReactDOM.render(<Benefits
        benefitsStatistics={benefitsStatistics}
    />, document.getElementById('renderTab'));
}

function benefitsStatistics(query) {
    return getRows("BENEFITS_STATISTICS", JSON.stringify(query));
}

/* MANUFACTURING ORDERS CREATED/MANUFACTURED */

function tabManufacturingQuantity() {
    ReactDOM.render(
        <ManufacturingQuantity
            manufacturingOrderCreatedManufacturedDaily={manufacturingOrderCreatedManufacturedDaily}
        />,
        document.getElementById('renderTab'));
}

function manufacturingOrderCreatedManufacturedDaily(query) {
    return getRows("MANUFACTURING_ORDER_CREATED_MANUFACTURES_DAILY", JSON.stringify(query));
}

/* DAILY SHIPPING QUANTITY */

function tabDailyShippingQuantity() {
    ReactDOM.render(
        <DailyShippingQuantity
            dailyShippingQuantity={dailyShippingQuantity}
        />,
        document.getElementById('renderTab'));
}

function dailyShippingQuantity() {
    return getRows("DAILY_SHIPPING_QUANTITY");
}

/* SHIPPINGS BY CARRIER */

function tabShippingsByCarrier() {
    ReactDOM.render(
        <ShippingsByCarrier
            shippingByCarriers={shippingByCarriers}
        />,
        document.getElementById('renderTab'));
}

function shippingByCarriers(query) {
    return getRows("SHIPPING_BY_CARRIERS", JSON.stringify(query));
}

/* API KEYS */

function tabApiKeys() {
    ReactDOM.render(
        <ApiKeys
            getApiKeys={getApiKeys}
            insertApiKey={insertApiKey}
            updateApiKey={updateApiKey}
            deleteApiKey={deleteApiKey}
            offApiKey={offApiKey}
            getEmptyApiKeyPermissionsObject={getEmptyApiKeyPermissionsObject}
            getUsers={getUsers}
        />,
        document.getElementById('renderTab'));
}

function getApiKeys() {
    return getRows("API_KEYS");
}

function insertApiKey(key) {
    return addRows("API_KEYS", key);
}

function updateApiKey(key) {
    return updateRows("API_KEY", key);
}

function deleteApiKey(keyId) {
    return deleteRows("API_KEYS", keyId);
}

function offApiKey(keyId) {
    return executeAction("API_KEYS", keyId);
}

function getEmptyApiKeyPermissionsObject() {
    return executeAction("GET_EMPTY_API_KEY_PERMISSIONS_OBJECT");
}

/* CONNECTION LOG */

function tabConnectionLog() {
    ReactDOM.render(
        <ConnectionLog
            getConnectionLogs={getConnectionLogs}
            getUsers={getUsers}
        />,
        document.getElementById('renderTab'));
}

function getConnectionLogs(query) {
    return getRows("CONNECTION_LOG", JSON.stringify(query));
}

/* CONNECTION FILTERS */

function tabConnectionFilters() {
    ReactDOM.render(
        <ConnectionFilters
            getConnectionFilters={getConnectionFilters}
            insertConnectionFilters={insertConnectionFilters}
            updateConnectionFilters={updateConnectionFilters}
            deleteConnectionFilters={deleteConnectionFilters}
            getConnectionFilterUser={getConnectionFilterUser}
            insertConnectionFilterUser={insertConnectionFilterUser}
            deleteConnectionFilterUser={deleteConnectionFilterUser}
            getUsers={getUsers}
        />,
        document.getElementById('renderTab'));
}

function getConnectionFilters() {
    return getRows("CONNECTION_FILTERS");
}

function insertConnectionFilters(filter) {
    return addRows("CONNECTION_FILTER", filter);
}

function updateConnectionFilters(filter) {
    return updateRows("CONNECTION_FILTER", filter);
}

function deleteConnectionFilters(filterId) {
    return deleteRows("CONNECTION_FILTER", filterId);
}

function getConnectionFilterUser(filterId) {
    return getRows("CONNECTION_FILTER_USERS", filterId);
}

function insertConnectionFilterUser(filterUser) {
    return addRows("CONNECTION_FILTER_USER", filterUser);
}

function deleteConnectionFilterUser(filterUser) {
    return deleteRows("CONNECTION_FILTER_USER", JSON.stringify(filterUser));
}

/* REPORT TEMPLATES */

function tabReportTemplates() {
    ReactDOM.render(
        <ReportTemplates
            getReportTemplates={getReportTemplates}
            updateReportTemplate={updateReportTemplate}
        />,
        document.getElementById('renderTab'));
}

function getReportTemplates() {
    return getRows("REPORT_TEMPLATE");
}

function updateReportTemplate(template) {
    return updateRows("REPORT_TEMPLATE", template);
}

/* POS TERMINALS */

function tabPosTerminals() {
    ReactDOM.render(
        <POSTerminals
            getPOSTerminals={getPOSTerminals}
            updatePOSTerminal={updatePOSTerminal}
            deletePOSTerminal={deletePOSTerminal}

            locateAddress={locateAddressByCustomer}
            locateCustomers={locateCustomers}
            locateCurrency={locateCurrency}
            locatePaymentMethods={locatePaymentMethods}
            locateBillingSeries={locateBillingSeries}
        />,
        document.getElementById('renderTab'));
}

function getPOSTerminals() {
    return getRows("POS_TERMINALS");
}

function updatePOSTerminal(terminal) {
    return updateRows("POS_TERMINAL", terminal);
}

function deletePOSTerminal(terminalUUID) {
    return deleteRows("POS_TERMINAL", terminalUUID);
}

/* POS TERMINAL SALES */

async function tabPOSTerminalSaleOrders() {
    await ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <POSTerminalSaleOrders
            getCookie={getCookie}
            posTerminalRequest={posTerminalRequest}
            unmountMainTab={unmountMainTab}
            posInsertNewSaleOrder={posInsertNewSaleOrder}
            posServeSaleOrder={posServeSaleOrder}
            posInsertNewSaleOrderDetail={posInsertNewSaleOrderDetail}
            getSalesOrderDetails={getSalesOrderDetails}
            getSalesOrderRow={getSalesOrderRow}
            documentFunctions={getDocumenetFunctions()}
            nextCustomer={tabPOSTerminalSaleOrders}
            deleteSalesOrderDetail={deleteSalesOrderDetail}
        />,
        document.getElementById('renderTab'));
}

function posTerminalRequest(terminalUUID) {
    return executeAction("POS_TERMINAL_REQUEST", terminalUUID);
}

function unmountMainTab() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
}

function posInsertNewSaleOrder(terminalUUID) {
    return executeAction("POS_INSERT_NEW_SALE_ORDER", terminalUUID);
}

function posServeSaleOrder(orderId) {
    return executeAction("POS_SERVE_SALE_ORDER", orderId);
}

function posInsertNewSaleOrderDetail(info) {
    return executeAction("POS_INSERT_NEW_SALE_ORDER_DETAIL", JSON.stringify(info));
}

/* WEBHOOK SETTINGS */

function tabWebHookSettings() {
    ReactDOM.render(<WebHookSettings
        getWebHookSettings={getWebHookSettings}
        insertWebHookSettings={insertWebHookSettings}
        updateWebHookSettings={updateWebHookSettings}
        deleteWebHookSettings={deleteWebHookSettings}
        renewAuthToken={renewAuthToken}
        getWebHookRequestQueue={getWebHookRequestQueue}
        getWebHookLogs={getWebHookLogs}
        tabWebHookSettings={tabWebHookSettings}
    />, document.getElementById('renderTab'));
}

function getWebHookSettings() {
    return getRows("WEBHOOK_SETTINGS");
}

function insertWebHookSettings(webhook) {
    return addRows("WEBHOOK_SETTINGS", webhook);
}

function updateWebHookSettings(webhook) {
    return updateRows("WEBHOOK_SETTINGS", webhook);
}

function deleteWebHookSettings(webhookId) {
    return deleteRows("WEBHOOK_SETTINGS", webhookId);
}

function renewAuthToken(webhook) {
    return executeAction("WEBHOOK_SETTINGS_RENEW_AUTH_TOKEN", JSON.stringify(webhook));
}

function getWebHookRequestQueue(webHookId) {
    return getRows("WEBHOOK_QUEUE", webHookId);
}

function getWebHookLogs(webHookId) {
    return getRows("WEBHOOK_LOGS", webHookId);
}

/* CHANGE PASSWORD CURRENT USER */

function tabChangePassword(mustChangeUserPassword = false) {
    if (mustChangeUserPassword != true && mustChangeUserPassword != false) {
        mustChangeUserPassword = false;
    }
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <ChangePassword
            userAutoPassword={userAutoPassword}
            mustChangeUserPassword={mustChangeUserPassword}
            evaluatePasswordSecureCloud={evaluatePasswordSecureCloud}
        />,
        document.getElementById('renderTab'));
}

function userAutoPassword(pwd) {
    return executeAction("USER_AUTO_PWD", JSON.stringify(pwd));
}

function getCurrentUserRow() {
    return executeAction("GET_CURRENT_USER");
}

/* EMAIL LOGS */

function tabEmailLogs() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <EmailLogs
            getEmailLogs={getEmailLogs}
        />,
        document.getElementById('renderTab'));
}

function getEmailLogs(query) {
    return getRows("EMAIL_LOGS", JSON.stringify(query));
}

/* REPORT TEMPLATE TRANSLATION */

function tabReportTemplateTranslation() {
    ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
    ReactDOM.render(
        <ReportTemplateTranslation
            getReportTemplateTranslations={getReportTemplateTranslations}
            insertReportTemplateTranslation={insertReportTemplateTranslation}
            updateReportTemplateTranslation={updateReportTemplateTranslation}
            deleteReportTemplateTranslation={deleteReportTemplateTranslation}
        />,
        document.getElementById('renderTab'));
};

function getReportTemplateTranslations() {
    return getRows("REPORT_TEMPLATE_TRANSLATION");
}

function insertReportTemplateTranslation(translation) {
    return addRows("REPORT_TEMPLATE_TRANSLATION", translation);
}

function updateReportTemplateTranslation(translation) {
    return updateRows("REPORT_TEMPLATE_TRANSLATION", translation);
}

function deleteReportTemplateTranslation(translation) {
    return deleteRows("REPORT_TEMPLATE_TRANSLATION", JSON.stringify(translation));
}



main();
