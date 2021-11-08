import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import SearchField from "../../SearchField";



class PostPurchaseInvoices extends Component {
    constructor({ getPurchaseInvoices, searchPurchaseInvoices, purchasePostInvoices }) {
        super();

        this.getPurchaseInvoices = getPurchaseInvoices;
        this.searchPurchaseInvoices = searchPurchaseInvoices;
        this.purchasePostInvoices = purchasePostInvoices;

        this.advancedSearchListener = null;
        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

        this.list = [];
        this.selectedInvoices = [];

        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
        this.post = this.post.bind(this);
    }

    componentDidMount() {
        this.searchPurchaseInvoices({
            notPosted: true
        }).then(async (invoices) => {
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
        const invoices = await this.searchPurchaseInvoices(search);
        this.renderInvoices(invoices);
    }

    async renderInvoices(invoices) {
        this.list = invoices;
        this.forceUpdate();
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <PurchaseInvoiceAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    post() {
        this.purchasePostInvoices(this.selectedInvoices).then((result) => {
            this.searchPurchaseInvoices({
                notPosted: true
            }).then((invoices) => {
                this.renderInvoices(invoices);
            });

            ReactDOM.render(<PostPurchaseInvoicesModal
                result={result}
            />, this.refs.renderModal);
        });
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <div ref="renderModal"></div>
            <h1>{i18next.t('post-purchase-invoices')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.post}>{i18next.t('post-selected')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'invoiceName', headerName: i18next.t('invoice-no'), width: 175 },
                    { field: 'supplierName', headerName: i18next.t('supplier'), flex: 1 },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'totalProducts', headerName: i18next.t('total-products'), width: 180 },
                    { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
                ]}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(data) => {
                    if (this.selectedInvoices.indexOf(data) < 0) {
                        this.selectedInvoices.push(data[0]);
                    } else {
                        this.selectedInvoices.splice(this.selectedInvoices.indexOf(data[0]), 1);
                    }
                }}
            />
        </div>
    }
}

class PurchaseInvoiceAdvancedSearch extends Component {
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

class PostPurchaseInvoicesModal extends Component {
    constructor({ result }) {
        super();

        this.result = result;
    }

    componentDidMount() {
        window.$('#resultModal').modal({ show: true });

        ReactDOM.render(this.result.map((element, i) => {
            return <PostPurchaseInvoicesModalResult
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

class PostPurchaseInvoicesModalResult extends Component {
    constructor({ result }) {
        super();

        this.result = result;
    }

    render() {
        return <tr>
            <th scope="row">{this.result.invoice}</th>
            <td>{this.result.ok ? "OK" :
                (this.result.result == 0 ? i18next.t('internal-error') : this.result.result == 1 ?
                    i18next.t('the-supplier-in-the-invoice-has-no-account') : "...")}</td>
        </tr>
    }
}

export default PostPurchaseInvoices;
