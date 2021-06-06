import { Component } from "react";
import ReactDOM from 'react-dom';

import SalesDeliveryNotesForm from "./SalesDeliveryNotesForm";
import SearchField from "../../SearchField";

class SalesDeliveryNotes extends Component {
    constructor({ getSalesDeliveryNotes, searchSalesDeliveryNotes, addSalesDeliveryNotes, deleteSalesDeliveryNotes, findCustomerByName, getCustomerName,
        findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName, getNameBillingSerie, getCustomerDefaults,
        locateAddress, tabSalesDeliveryNotes, getNameAddress, getSalesDeliveryNoteDetails, findProductByName, getNameProduct, addWarehouseMovements,
        deleteWarehouseMovements, getSalesDeliveryNotesRelations, findWarehouseByName, getNameWarehouse, documentFunctions }) {
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

        this.advancedSearchListener = null;

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
            element.customerName = "...";
            return <SalesDeliveryNote key={i}
                note={element}
                edit={this.edit}
            />
        }), this.refs.render);

        for (let i = 0; i < notes.length; i++) {
            notes[i].customerName = await this.getCustomerName(notes[i].customer);
        }

        ReactDOM.render(notes.map((element, i) => {
            return <SalesDeliveryNote key={i}
                note={element}
                edit={this.edit}
            />
        }), this.refs.render);
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
        return <div id="tabSalesOrders" className="formRowRoot">
            <h1>Sales Delivery Notes</h1>
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
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Delivery note no.</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total products</th>
                        <th scope="col">Total amount</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class SalesDeliveryNote extends Component {
    constructor({ note, edit }) {
        super();

        this.note = note;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.note);
        }}>
            <th scope="row">{this.note.id}</th>
            <td>{this.note.deliveryNoteName}</td>
            <td>{this.note.customerName}</td>
            <td>{window.dateFormat(new Date(this.note.dateCreated))}</td>
            <td>{this.note.totalProducts}</td>
            <td>{this.note.totalAmount}</td>
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
                <label for="start">Start date:</label>
                <br />
                <input type="date" class="form-control" ref="start" />
            </div>
            <div class="col">
                <label for="start">End date:</label>
                <br />
                <input type="date" class="form-control" ref="end" />
            </div>
        </div>
    }
}

export default SalesDeliveryNotes;
