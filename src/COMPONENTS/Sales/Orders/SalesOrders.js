import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SalesOrderForm from './SalesOrderForm';
import SearchField from '../../SearchField';
import TableContextMenu from '../../VisualComponents/TableContextMenu';

const saleOrderStates = {
    '_': "Waiting for payment",
    'A': "Waiting for purchase order",
    'B': "Purchase order pending",
    'C': "Waiting for manufacturing orders",
    'D': "Manufacturing orders pending",
    'E': "Sent to preparation",
    'F': "Awaiting for shipping",
    'G': "Shipped",
    'H': "Receiced by the customer"
}


class SalesOrders extends Component {
    constructor({ findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesOrders, addSalesOrder, getSalesOrder, getSalesOrderRow,
        searchSalesOrder, getNameAddress, getOrderDetailsDefaults, findProductByName, getSalesOrderDetails, addSalesOrderDetail, updateSalesOrderDetail,
        getNameProduct, updateSalesOrder, deleteSalesOrder, deleteSalesOrderDetail, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts,
        invoiceAllSaleOrder, invoiceSelectionSaleOrder, getSalesOrderRelations, manufacturingOrderAllSaleOrder, manufacturingOrderPartiallySaleOrder,
        deliveryNoteAllSaleOrder, deliveryNotePartiallySaleOrder, findCarrierByName, getNameCarrier, findWarehouseByName, getNameWarehouse, salesOrderDefaults,
        documentFunctions, getCustomerRow, sendEmail }) {
        super();

        this.findCustomerByName = findCustomerByName;
        this.getCustomerName = getCustomerName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getCustomerDefaults = getCustomerDefaults;
        this.locateAddress = locateAddress;
        this.tabSalesOrders = tabSalesOrders;
        this.addSalesOrder = addSalesOrder;
        this.getSalesOrder = getSalesOrder;
        this.getSalesOrderRow = getSalesOrderRow;
        this.searchSalesOrder = searchSalesOrder;
        this.getNameAddress = getNameAddress;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.findProductByName = findProductByName;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.addSalesOrderDetail = addSalesOrderDetail;
        this.updateSalesOrderDetail = updateSalesOrderDetail;
        this.getNameProduct = getNameProduct;
        this.updateSalesOrder = updateSalesOrder;
        this.deleteSalesOrder = deleteSalesOrder;
        this.deleteSalesOrderDetail = deleteSalesOrderDetail;
        this.getSalesOrderDiscounts = getSalesOrderDiscounts;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;
        this.deleteSalesOrderDiscounts = deleteSalesOrderDiscounts;
        this.invoiceAllSaleOrder = invoiceAllSaleOrder;
        this.invoiceSelectionSaleOrder = invoiceSelectionSaleOrder;
        this.getSalesOrderRelations = getSalesOrderRelations;
        this.manufacturingOrderAllSaleOrder = manufacturingOrderAllSaleOrder;
        this.manufacturingOrderPartiallySaleOrder = manufacturingOrderPartiallySaleOrder;
        this.deliveryNoteAllSaleOrder = deliveryNoteAllSaleOrder;
        this.deliveryNotePartiallySaleOrder = deliveryNotePartiallySaleOrder;
        this.findCarrierByName = findCarrierByName;
        this.getNameCarrier = getNameCarrier;
        this.findWarehouseByName = findWarehouseByName;
        this.getNameWarehouse = getNameWarehouse;
        this.salesOrderDefaults = salesOrderDefaults;
        this.documentFunctions = documentFunctions;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;

        this.advancedSearchListener = null;
        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.getSalesOrder().then((salesOrders) => {
            this.renderSaleOrder(salesOrders);
        });
    }

    async search(searchText) {
        const search = {
            search: searchText
        };

        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            search.dateStart = s.dateStart;
            search.dateEnd = s.dateEnd;
            search.status = s.status;
        }
        const salesOrders = await this.searchSalesOrder(search);
        this.renderSaleOrder(salesOrders);
        this.list = salesOrders;
    }

    async renderSaleOrder(salesOrders) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        var totalProducts = 0;
        var totalAmount = 0;
        ReactDOM.render(salesOrders.map((element, i) => {
            element.dateCreated = new Date(element.dateCreated);
            if (element.datePaymetAccepted != null) {
                element.datePaymetAccepted = new Date(element.datePaymetAccepted);
            }
            totalProducts += element.totalProducts;
            totalAmount += element.totalAmount;
            element.customerName = "...";
            return <SaleOrder key={i}
                saleOrder={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);
        this.refs.rows.innerText = salesOrders.length;
        this.refs.totalProducts.innerText = totalProducts;
        this.refs.totalAmount.innerText = totalAmount;

        for (let i = 0; i < salesOrders.length; i++) {
            salesOrders[i].customerName = await this.getCustomerName(salesOrders[i].customer);
        }

        ReactDOM.render(salesOrders.map((element, i) => {
            return <SaleOrder key={i}
                saleOrder={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);
        this.list = salesOrders;
    }

    async add() {
        const defaults = await this.salesOrderDefaults();

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesOrderForm
                findCustomerByName={this.findCustomerByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesOrders={this.tabSalesOrders}
                addSalesOrder={this.addSalesOrder}
                findCarrierByName={this.findCarrierByName}
                findWarehouseByName={this.findWarehouseByName}
                defaultValueNameWarehouse={defaults.warehouseName}
                defaultWarehouse={defaults.warehouse}
            />,
            document.getElementById('renderTab'));
    }

    async edit(saleOrder) {
        var defaultValueNameCustomer;
        if (saleOrder.customer != null)
            defaultValueNameCustomer = await this.getCustomerName(saleOrder.customer);
        var defaultValueNamePaymentMethod;
        if (saleOrder.paymentMethod != null)
            defaultValueNamePaymentMethod = await this.getNamePaymentMethod(saleOrder.paymentMethod);
        var defaultValueNameCurrency;
        if (saleOrder.currency != null)
            defaultValueNameCurrency = await this.getNameCurrency(saleOrder.currency);
        var defaultValueNameBillingSerie;
        if (saleOrder.billingSeries != null)
            defaultValueNameBillingSerie = await this.getNameBillingSerie(saleOrder.billingSeries);
        var defaultValueNameBillingAddress;
        if (saleOrder.billingAddress != null)
            defaultValueNameBillingAddress = await this.getNameAddress(saleOrder.billingAddress);
        var defaultValueNameShippingAddress;
        if (saleOrder.shippingAddress != null)
            defaultValueNameShippingAddress = await this.getNameAddress(saleOrder.shippingAddress);
        var defaultValueNameCarrier;
        if (saleOrder.carrier != null)
            defaultValueNameCarrier = await this.getNameCarrier(saleOrder.carrier);
        var defaultValueNameWarehouse = await this.getNameWarehouse(saleOrder.warehouse);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesOrderForm
                order={saleOrder}

                findCustomerByName={this.findCustomerByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesOrders={this.tabSalesOrders}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                findProductByName={this.findProductByName}
                getSalesOrderDetails={this.getSalesOrderDetails}
                addSalesOrderDetail={this.addSalesOrderDetail}
                updateSalesOrderDetail={this.updateSalesOrderDetail}
                getNameProduct={this.getNameProduct}
                updateSalesOrder={this.updateSalesOrder}
                deleteSalesOrder={this.deleteSalesOrder}
                deleteSalesOrderDetail={this.deleteSalesOrderDetail}
                getSalesOrderDiscounts={this.getSalesOrderDiscounts}
                addSalesOrderDiscounts={this.addSalesOrderDiscounts}
                deleteSalesOrderDiscounts={this.deleteSalesOrderDiscounts}
                invoiceAllSaleOrder={this.invoiceAllSaleOrder}
                invoiceSelectionSaleOrder={this.invoiceSelectionSaleOrder}
                getSalesOrderRelations={this.getSalesOrderRelations}
                manufacturingOrderAllSaleOrder={this.manufacturingOrderAllSaleOrder}
                manufacturingOrderPartiallySaleOrder={this.manufacturingOrderPartiallySaleOrder}
                deliveryNoteAllSaleOrder={this.deliveryNoteAllSaleOrder}
                deliveryNotePartiallySaleOrder={this.deliveryNotePartiallySaleOrder}
                findCarrierByName={this.findCarrierByName}
                findWarehouseByName={this.findWarehouseByName}
                documentFunctions={this.documentFunctions}
                getSalesOrderRow={this.getSalesOrderRow}
                getCustomerRow={this.getCustomerRow}
                sendEmail={this.sendEmail}

                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameCurrency={defaultValueNameCurrency}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameBillingAddress={defaultValueNameBillingAddress}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                defaultValueNameCarrier={defaultValueNameCarrier}
                defaultValueNameWarehouse={defaultValueNameWarehouse}
            />,
            document.getElementById('renderTab'));
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <SaleOrderAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <h1>Sales Orders</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr onClick={(e) => {
                        e.preventDefault();
                        const field = e.target.getAttribute("field");

                        if (this.sortField == field) {
                            this.sortAscending = !this.sortAscending;
                        }
                        this.sortField = field;

                        var greaterThan = 1;
                        var lessThan = -1;
                        if (!this.sortAscending) {
                            greaterThan = -1;
                            lessThan = -1;
                        }

                        this.list.sort((a, b) => {
                            if (a[field] > b[field]) {
                                return greaterThan;
                            } else if (a[field] < b[field]) {
                                return lessThan;
                            } else {
                                return 0;
                            }
                        });
                        this.renderSaleOrder(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="orderName" scope="col">Order no.</th>
                        <th field="reference" scope="col">Reference</th>
                        <th field="customerName" scope="col">Customer</th>
                        <th field="dateCreated" scope="col">Date</th>
                        <th field="totalProducts" scope="col">Total products</th>
                        <th field="totalAmount" scope="col">Total amount</th>
                        <th field="status" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody ref="render" onContextMenu={(e) => {
                    e.preventDefault();
                    const posX = e.pageX + "px";
                    const posY = e.pageY + "px";
                    if (document.getElementById("customContextMenu") === null) {
                        ReactDOM.render(<TableContextMenu
                            posX={posX}
                            posY={posY}
                            getList={() => {
                                return this.list;
                            }}
                            setList={(list) => {
                                this.renderSaleOrder(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["id", "orderName", "reference", "customerName", "dateCreated", "totalProducts", "totalAmount", "status"]}
                        />, document.getElementById("contextMenu"));
                    } else {
                        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
                    }
                }}></tbody>
                <tfoot>
                    <tr>
                        <th ref="rows" scope="row">0</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td ref="totalProducts">0</td>
                        <td ref="totalAmount">0</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    }
}

class SaleOrder extends Component {
    constructor({ saleOrder, edit, pos }) {
        super();

        this.saleOrder = saleOrder;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.saleOrder);
        }} pos={this.pos}>
            <th field="id" scope="row">{this.saleOrder.id}</th>
            <td field="orderName">{this.saleOrder.orderName}</td>
            <td field="reference">{this.saleOrder.reference}</td>
            <td field="customerName">{this.saleOrder.customerName}</td>
            <td field="dateCreated">{window.dateFormat(this.saleOrder.dateCreated)}</td>
            <td field="totalProducts">{this.saleOrder.totalProducts}</td>
            <td field="totalAmount">{this.saleOrder.totalAmount}</td>
            <td field="status">{saleOrderStates[this.saleOrder.status]}</td>
        </tr>
    }
}

class SaleOrderAdvancedSearch extends Component {
    constructor({ subscribe }) {
        super();

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    getFormData() {
        const search = {};
        if (this.refs.start.value !== "") {
            search.dateStart = new Date(this.refs.start.value);
        }
        if (this.refs.end.value !== "") {
            search.dateEnd = new Date(this.refs.end.value);
        }
        search.status = this.refs.status.value;
        return search;
    }

    render() {
        return <div class="form-row">
            <div class="col">
                <label for="start">Start date:</label>
                <br />
                <input type="date" class="form-control" ref="start" />
            </div>
            <div class="col">
                <label for="start">End date:</label>
                <br />
                <input type="date" class="form-control" ref="end" />
            </div>
            <div class="col">
                <label>Status</label>
                <select class="form-control" ref="status">
                    <option value="">.All</option>
                    <option value="_">Waiting for payment</option>
                    <option value="A">Waiting for purchase order</option>
                    <option value="B">Purchase order pending</option>
                    <option value="C">Waiting for manufacturing orders</option>
                    <option value="D">Manufacturing orders pending</option>
                    <option value="E">Sent to preparation</option>
                    <option value="F">Awaiting for shipping</option>
                    <option value="G">Shipped</option>
                    <option value="H">Receiced by the customer</option>
                </select>
            </div>
        </div>
    }
}

export default SalesOrders;
