import { Component } from "react";
import ReactDOM from 'react-dom';
import PurchaseDeliveryNotesForm from "./PurchaseDeliveryNotesForm";
import SearchField from "../../SearchField";
import TableContextMenu from "../../VisualComponents/TableContextMenu";

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
        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

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
            element.dateCreated = new Date(element.dateCreated);

            return <PurchaseDeliveryNote key={i}
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
        return <div id="tabSalesOrders" className="formRowRoot menu">
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
                        this.renderPurchaseDeliveryNotes(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="deliveryNoteName" scope="col">Delivery note no.</th>
                        <th field="supplierName" scope="col">Supplier</th>
                        <th field="dateCreated" scope="col">Date</th>
                        <th field="totalProducts" scope="col">Total products</th>
                        <th field="totalAmount" scope="col">Total amount</th>
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
                                this.renderPurchaseDeliveryNotes(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["id", "deliveryNoteName", "supplierName", "dateCreated", "totalProducts", "totalAmount"]}
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

class PurchaseDeliveryNote extends Component {
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
            <td field="supplierName">{this.note.supplierName}</td>
            <td field="dateCreated">{window.dateFormat(this.note.dateCreated)}</td>
            <td field="totalProducts">{this.note.totalProducts}</td>
            <td field="totalAmount">{this.note.totalAmount}</td>
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
