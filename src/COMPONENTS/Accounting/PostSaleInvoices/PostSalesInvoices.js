import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import SearchField from "../../SearchField";
import TableContextMenu from "../../VisualComponents/TableContextMenu";

class PostSalesInvoices extends Component {
    constructor({ getSalesInvoices, searchSalesInvoices, salesPostInvoices }) {
        super();

        this.getSalesInvoices = getSalesInvoices;
        this.searchSalesInvoices = searchSalesInvoices;
        this.salesPostInvoices = salesPostInvoices;

        this.advancedSearchListener = null;
        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
        this.edit = this.edit.bind(this);
        this.post = this.post.bind(this);
        this.all = this.all.bind(this);
        this.none = this.none.bind(this);
    }

    componentDidMount() {
        this.searchSalesInvoices({
            notPosted: true
        }).then((invoices) => {
            this.renderInvoices(invoices);
        });
    }

    async search(searchText) {
        const search = {
            search: searchText,
            notPosted: true
        };

        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            search.dateStart = s.dateStart;
            search.dateEnd = s.dateEnd;
        }
        const invoices = await this.searchSalesInvoices(search);
        this.renderInvoices(invoices);
    }

    async renderInvoices(invoices) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        var totalProducts = 0;
        var totalAmount = 0;
        await ReactDOM.render(invoices.map((element, i) => {
            element.dateCreated = new Date(element.dateCreated);
            totalProducts += element.totalProducts;
            totalAmount += element.totalAmount;

            return <SalesInvoice key={i}
                invoice={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);
        this.refs.rows.innerText = invoices.length;
        this.refs.totalProducts.innerText = totalProducts;
        this.refs.totalAmount.innerText = totalAmount;

        this.list = invoices;
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <SaleInvoiceAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    edit(invoice) {
        invoice.selected = !invoice.selected;
        this.renderInvoices(this.list);
    }

    post() {
        const invoiceIds = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].selected) {
                invoiceIds.push(this.list[i].id);
            }
        }

        this.salesPostInvoices(invoiceIds).then((result) => {
            this.searchSalesInvoices({
                notPosted: true
            }).then((invoices) => {
                this.renderInvoices(invoices);
            });

            ReactDOM.render(<PostSaleInvoicesModal
                result={result}
            />, this.refs.renderModal);
        });
    }

    all() {
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].selected = true;
        }
        this.renderInvoices(this.list);
    }

    none() {
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].selected = false;
        }
        this.renderInvoices(this.list);
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <div ref="renderModal"></div>
            <div className="menu">
                <h1>{i18next.t('post-sale-invoices')}</h1>
                <div class="form-row">
                    <div class="col">
                        <button type="button" class="btn btn-primary" onClick={this.post}>{i18next.t('post-selected')}</button>
                        <button type="button" class="btn btn-primary" onClick={this.all}>{i18next.t('select-all')}</button>
                        <button type="button" class="btn btn-primary ml-1" onClick={this.none}>{i18next.t('select-none')}</button>
                    </div>
                    <div class="col">
                        <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                        <div ref="advancedSearch" className="advancedSearch"></div>
                    </div>
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
                        this.renderInvoices(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="invoiceName" scope="col">{i18next.t('invoice-no')}</th>
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
                                this.renderInvoices(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["id", "invoiceName", "customerName", "dateCreated", "totalProducts", "totalAmount"]}
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
                        <td ref="totalProducts">0</td>
                        <td ref="totalAmount">0</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    }
}

class SalesInvoice extends Component {
    constructor({ invoice, edit, pos }) {
        super();

        this.invoice = invoice;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr className={this.invoice.selected ? 'bg-primary' : ''} onClick={() => {
            this.edit(this.invoice);
        }} pos={this.pos}>
            <th field="id" scope="row">{this.invoice.id}</th>
            <td field="invoiceName">{this.invoice.invoiceName}</td>
            <td field="customerName">{this.invoice.customerName}</td>
            <td field="dateCreated">{window.dateFormat(this.invoice.dateCreated)}</td>
            <td field="totalProducts">{this.invoice.totalProducts}</td>
            <td field="totalAmount">{this.invoice.totalAmount}</td>
        </tr>
    }
}

class SaleInvoiceAdvancedSearch extends Component {
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

class PostSaleInvoicesModal extends Component {
    constructor({ result }) {
        super();

        this.result = result;
    }

    componentDidMount() {
        window.$('#resultModal').modal({ show: true });

        ReactDOM.render(this.result.map((element, i) => {
            return <PostSaleInvoicesModalResult
                key={i}
                result={element}
            />
        }), this.refs.render);
    }

    render() {
        return <div class="modal fade" id="resultModal" tabindex="-1" role="dialog" aria-labelledby="resultModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="resultModalLabel">{i18next.t('post-result')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">{i18next.t('result')}</th>
                                </tr>
                            </thead>
                            <tbody ref="render"></tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

class PostSaleInvoicesModalResult extends Component {
    constructor({ result }) {
        super();

        this.result = result;
    }

    render() {
        return <tr>
            <th scope="row">{this.result.invoice}</th>
            <td>{this.result.ok ? "OK" :
                (this.result.result == 0 ? i18next.t('internal-error') : this.result.result == 1 ?
                    i18next.t('the-customer-in-the-invoice-has-no-account') : "...")}</td>
        </tr>
    }
}

export default PostSalesInvoices;
