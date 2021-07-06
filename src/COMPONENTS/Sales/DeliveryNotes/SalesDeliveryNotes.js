import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import SalesDeliveryNotesForm from "./SalesDeliveryNotesForm";
import SearchField from "../../SearchField";
import TableContextMenu from "../../VisualComponents/TableContextMenu";

class SalesDeliveryNotes extends Component {
    constructor({ getSalesDeliveryNotes, searchSalesDeliveryNotes, addSalesDeliveryNotes, deleteSalesDeliveryNotes, findCustomerByName, getCustomerName,
        findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName, getNameBillingSerie, getCustomerDefaults,
        locateAddress, tabSalesDeliveryNotes, getNameAddress, getSalesDeliveryNoteDetails, findProductByName, getNameProduct, addWarehouseMovements,
        deleteWarehouseMovements, getSalesDeliveryNotesRelations, findWarehouseByName, getNameWarehouse, documentFunctions, getCustomerRow, sendEmail }) {
        super();

        this.getSalesDeliveryNotes = getSalesDeliveryNotes;
        this.searchSalesDeliveryNotes = searchSalesDeliveryNotes;
        this.addSalesDeliveryNotes = addSalesDeliveryNotes;
        this.deleteSalesDeliveryNotes = deleteSalesDeliveryNotes;

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
        this.tabSalesDeliveryNotes = tabSalesDeliveryNotes;
        this.getNameAddress = getNameAddress;
        this.getSalesDeliveryNoteDetails = getSalesDeliveryNoteDetails;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.getSalesDeliveryNotesRelations = getSalesDeliveryNotesRelations;
        this.findWarehouseByName = findWarehouseByName;
        this.getNameWarehouse = getNameWarehouse;
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
        this.getSalesDeliveryNotes().then(async (notes) => {
            this.renderDeliveryNotes(notes);
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
        }
        const notes = await this.searchSalesDeliveryNotes(search);
        this.renderDeliveryNotes(notes);
    }

    async renderDeliveryNotes(notes) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        await ReactDOM.render(notes.map((element, i) => {
            element.dateCreated = new Date(element.dateCreated);

            return <SalesDeliveryNote key={i}
                note={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);
        this.refs.rows.innerText = notes.length;
        
        this.list = notes;
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesDeliveryNotesForm
                addSalesDeliveryNotes={this.addSalesDeliveryNotes}
                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}

                findCustomerByName={this.findCustomerByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesDeliveryNotes={this.tabSalesDeliveryNotes}
                findWarehouseByName={this.findWarehouseByName}
            />,
            document.getElementById('renderTab'));
    }

    async edit(note) {
        const defaultValueNameCustomer = await this.getCustomerName(note.customer);
        const defaultValueNamePaymentMethod = await this.getNamePaymentMethod(note.paymentMethod);
        const defaultValueNameCurrency = await this.getNameCurrency(note.currency);
        const defaultValueNameBillingSerie = await this.getNameBillingSerie(note.billingSeries);
        const defaultValueNameShippingAddress = await this.getNameAddress(note.shippingAddress);
        const defaultValueNameWarehouse = await this.getNameWarehouse(note.warehouse);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesDeliveryNotesForm
                note={note}
                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}
                tabSalesDeliveryNotes={this.tabSalesDeliveryNotes}
                getSalesDeliveryNoteDetails={this.getSalesDeliveryNoteDetails}
                findProductByName={this.findProductByName}
                getNameProduct={this.getNameProduct}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getSalesDeliveryNotesRelations={this.getSalesDeliveryNotesRelations}
                findWarehouseByName={this.findWarehouseByName}
                documentFunctions={this.documentFunctions}
                getCustomerRow={this.getCustomerRow}
                sendEmail={this.sendEmail}

                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameCurrency={defaultValueNameCurrency}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
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
                <SaleDeliveryNoteAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot menu">
            <h1>{i18next.t('sales-delivery-notes')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
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
                        this.renderDeliveryNotes(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="deliveryNoteName" scope="col">{i18next.t('delivery-note-no')}</th>
                        <th field="customerName" scope="col">{i18next.t('customer')}</th>
                        <th field="dateCreated" scope="col">{i18next.t('date')}</th>
                        <th field="totalProducts" scope="col">{i18next.t('total-products')}</th>
                        <th field="totalAmount" scope="col">{i18next.t('total-amount')}</th>
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
                                this.renderDeliveryNotes(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["id", "deliveryNoteName", "customerName", "dateCreated", "totalProducts", "totalAmount"]}
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
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    }
}

class SalesDeliveryNote extends Component {
    constructor({ note, edit, pos }) {
        super();

        this.note = note;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.note);
        }} pos={this.pos}>
            <th field="id" scope="row">{this.note.id}</th>
            <td field="deliveryNoteName">{this.note.deliveryNoteName}</td>
            <td field="customerName">{this.note.customerName}</td>
            <td field="dateCreated">{window.dateFormat(this.note.dateCreated)}</td>
            <td field="totalProducts">{this.note.totalProducts}</td>
            <td field="totalAmount">{this.note.totalAmount}</td>
        </tr>
    }
}

class SaleDeliveryNoteAdvancedSearch extends Component {
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
        return search;
    }

    render() {
        return <div class="form-row">
            <div class="col">
                <label for="start">{i18next.t('start-date')}:</label>
                <br />
                <input type="date" class="form-control" ref="start" />
            </div>
            <div class="col">
                <label for="start">{i18next.t('end-date')}:</label>
                <br />
                <input type="date" class="form-control" ref="end" />
            </div>
        </div>
    }
}

export default SalesDeliveryNotes;
