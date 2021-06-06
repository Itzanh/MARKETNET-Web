import { Component } from "react";
import ReactDOM from 'react-dom';
import PurchaseDeliveryNotesForm from "./PurchaseDeliveryNotesForm";
import SearchField from "../../SearchField";

class PurchaseDeliveryNotes extends Component {
    constructor({ getPurchaseDeliveryNotes, searchPurchaseDeliveryNotes, addPurchaseDeliveryNotes, deletePurchaseDeliveryNotes, findSupplierByName,
        getSupplierName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName, getNameBillingSerie,
        getSupplierDefaults, locateAddress, tabPurchaseDeliveryNotes, getNameAddress, getPurchaseDeliveryNoteDetails, findProductByName, getNameProduct,
        addWarehouseMovements, deleteWarehouseMovements, getPurchaseDeliveryNotesRelations, findWarehouseByName, getNameWarehouse, documentFunctions }) {
        super();

        this.getPurchaseDeliveryNotes = getPurchaseDeliveryNotes;
        this.searchPurchaseDeliveryNotes = searchPurchaseDeliveryNotes;
        this.addPurchaseDeliveryNotes = addPurchaseDeliveryNotes;
        this.deletePurchaseDeliveryNotes = deletePurchaseDeliveryNotes;

        this.findSupplierByName = findSupplierByName;
        this.getSupplierName = getSupplierName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurchaseDeliveryNotes = tabPurchaseDeliveryNotes;
        this.getNameAddress = getNameAddress;
        this.getPurchaseDeliveryNoteDetails = getPurchaseDeliveryNoteDetails;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.getPurchaseDeliveryNotesRelations = getPurchaseDeliveryNotesRelations;
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
        this.getPurchaseDeliveryNotes().then((notes) => {
            this.renderPurchaseDeliveryNotes(notes);
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
        const notes = await this.searchPurchaseDeliveryNotes(search);
        this.renderPurchaseDeliveryNotes(notes);
    }

    async renderPurchaseDeliveryNotes(notes) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        await ReactDOM.render(notes.map((element, i) => {
            element.supplierName = "...";
            return <PurchaseDeliveryNote key={i}
                note={element}
                edit={this.edit}
            />
        }), this.refs.render);

        for (let i = 0; i < notes.length; i++) {
            notes[i].supplierName = await this.getSupplierName(notes[i].supplier);
        }

        ReactDOM.render(notes.map((element, i) => {
            return <PurchaseDeliveryNote key={i}
                note={element}
                edit={this.edit}
            />
        }), this.refs.render);
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PurchaseDeliveryNotesForm
                addPurchaseDeliveryNotes={this.addPurchaseDeliveryNotes}
                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}

                findSupplierByName={this.findSupplierByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getSupplierDefaults={this.getSupplierDefaults}
                locateAddress={this.locateAddress}
                tabPurchaseDeliveryNotes={this.tabPurchaseDeliveryNotes}
                findWarehouseByName={this.findWarehouseByName}
            />,
            document.getElementById('renderTab'));
    }

    async edit(note) {
        const defaultValueNameSupplier = await this.getSupplierName(note.supplier);
        const defaultValueNamePaymentMethod = await this.getNamePaymentMethod(note.paymentMethod);
        const defaultValueNameCurrency = await this.getNameCurrency(note.currency);
        const defaultValueNameBillingSerie = await this.getNameBillingSerie(note.billingSeries);
        const defaultValueNameShippingAddress = await this.getNameAddress(note.shippingAddress);
        const defaultValueNameWarehouse = await this.getNameWarehouse(note.warehouse);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PurchaseDeliveryNotesForm
                note={note}
                deletePurchaseDeliveryNotes={this.deletePurchaseDeliveryNotes}
                tabPurchaseDeliveryNotes={this.tabPurchaseDeliveryNotes}
                getPurchaseDeliveryNoteDetails={this.getPurchaseDeliveryNoteDetails}
                findProductByName={this.findProductByName}
                getNameProduct={this.getNameProduct}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getPurchaseDeliveryNotesRelations={this.getPurchaseDeliveryNotesRelations}
                findWarehouseByName={this.findWarehouseByName}
                documentFunctions={this.documentFunctions}

                defaultValueNameSupplier={defaultValueNameSupplier}
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
                <PurchaseDeliveryNoteAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <h1>Purchase Delivery Notes</h1>
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
                        <th scope="col">Supplier</th>
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

class PurchaseDeliveryNote extends Component {
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
            <td>{this.note.supplierName}</td>
            <td>{window.dateFormat(new Date(this.note.dateCreated))}</td>
            <td>{this.note.totalProducts}</td>
            <td>{this.note.totalAmount}</td>
        </tr>
    }
}

class PurchaseDeliveryNoteAdvancedSearch extends Component {
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

export default PurchaseDeliveryNotes;
