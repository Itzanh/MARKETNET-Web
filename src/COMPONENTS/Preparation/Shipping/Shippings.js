import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import ShippingForm from "./ShippingForm";
import SearchField from "../../SearchField";



class Shippings extends Component {
    constructor({ getShippings, searchShippings, getShippingPackaging, addShipping, updateShipping, deleteShipping, locateAddress,
        defaultValueNameShippingAddress, findCarrierByName, defaultValueNameCarrier, locateSaleOrder, locateSaleDeliveryNote,
        tabShipping, toggleShippingSent, documentFunctions, getIncoterms, getShippingTags, getRegisterTransactionalLogs,
        getShippingStatusHistory }) {
        super();

        this.getShippings = getShippings;
        this.searchShippings = searchShippings;
        this.getShippingPackaging = getShippingPackaging;
        this.addShipping = addShipping;
        this.updateShipping = updateShipping;
        this.deleteShipping = deleteShipping;
        this.locateAddress = locateAddress;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;
        this.findCarrierByName = findCarrierByName;
        this.defaultValueNameCarrier = defaultValueNameCarrier;
        this.locateSaleOrder = locateSaleOrder;
        this.locateSaleDeliveryNote = locateSaleDeliveryNote;
        this.tabShipping = tabShipping;
        this.toggleShippingSent = toggleShippingSent;
        this.documentFunctions = documentFunctions;
        this.getIncoterms = getIncoterms;
        this.getShippingTags = getShippingTags;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getShippingStatusHistory = getShippingStatusHistory;

        this.advancedSearchListener = null;
        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.getShippings().then((shippings) => {
            this.renderShipping(shippings);
        });
    }

    async search(searchText) {
        const search = {
            search: searchText,
        };

        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            search.dateStart = s.dateStart;
            search.dateEnd = s.dateEnd;
            search.status = s.status;
        }

        const shippings = await this.searchShippings(search);
        this.renderShipping(shippings);
    }

    renderShipping(shippings) {
        this.list = shippings;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <ShippingForm
                addShipping={this.addShipping}
                locateAddress={this.locateAddress}
                findCarrierByName={this.findCarrierByName}
                locateSaleOrder={this.locateSaleOrder}
                locateSaleDeliveryNote={this.locateSaleDeliveryNote}
                tabShipping={this.tabShipping}
                toggleShippingSent={this.toggleShippingSent}
                getIncoterms={this.getIncoterms}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            />,
            document.getElementById('renderTab'));
    }

    async edit(shipping) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <ShippingForm
                shipping={shipping}
                updateShipping={this.updateShipping}
                deleteShipping={this.deleteShipping}
                locateAddress={this.locateAddress}
                findCarrierByName={this.findCarrierByName}
                locateSaleOrder={this.locateSaleOrder}
                locateSaleDeliveryNote={this.locateSaleDeliveryNote}
                tabShipping={this.tabShipping}
                getShippingPackaging={this.getShippingPackaging}
                toggleShippingSent={this.toggleShippingSent}
                documentFunctions={this.documentFunctions}
                getIncoterms={this.getIncoterms}
                getShippingTags={this.getShippingTags}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getShippingStatusHistory={this.getShippingStatusHistory}

            />,
            document.getElementById('renderTab'));
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <ShippingsAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabShippings" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('shippings')}</h4>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
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
                    {
                        field: 'customerName', headerName: i18next.t('customer'), flex: 1, valueGetter: (params) => {
                            return params.row.order.customer.name;
                        }
                    },
                    {
                        field: 'saleOrderName', headerName: i18next.t('sale-order'), width: 200, valueGetter: (params) => {
                            return params.row.order.orderName;
                        }
                    },
                    {
                        field: 'carrierName', headerName: i18next.t('carrier'), width: 250, valueGetter: (params) => {
                            return params.row.carrier.name;
                        }
                    },
                    { field: 'weight', headerName: i18next.t('weight'), width: 124 },
                    { field: 'packagesNumber', headerName: i18next.t('n-packages'), width: 160 },
                    { field: 'trackingNumber', headerName: 'Tracking', width: 180 },
                    { field: 'sent', headerName: i18next.t('sent'), width: 140, type: 'boolean' },
                    { field: 'collected', headerName: i18next.t('collected'), width: 140, type: 'boolean' },
                    { field: 'delivered', headerName: i18next.t('delivered'), width: 140, type: 'boolean' },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}



class ShippingsAdvancedSearch extends Component {
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
        return <div className="advancedSearchContent">
            <div class="form-row">
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
                <div class="col">
                    <label>Status</label>
                    <select class="form-control" ref="status">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="S">{i18next.t('shipped')}</option>
                        <option value="N">{i18next.t('not-shipped')}</option>
                    </select>
                </div>
            </div>
        </div>
    }
}



export default Shippings;
