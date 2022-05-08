import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import LocateAddress from "../../Masters/Addresses/LocateAddress";
import AutocompleteField from "../../AutocompleteField";
import LocateSalesOrder from "../../Sales/Orders/LocateSalesOrder";
import LocateSalesDeliveryNote from "../../Sales/DeliveryNotes/LocateSalesDeliveryNote";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";
import { DataGrid } from "@material-ui/data-grid";

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';



class ShippingForm extends Component {
    constructor({ shipping, addShipping, updateShipping, deleteShipping, locateAddress, findCarrierByName,
        locateSaleOrder, locateSaleDeliveryNote, tabShipping,
        getShippingPackaging, toggleShippingSent, documentFunctions, getIncoterms, getShippingTags, getRegisterTransactionalLogs, getShippingStatusHistory }) {
        super();

        this.shipping = shipping;
        this.addShipping = addShipping;
        this.updateShipping = updateShipping;
        this.deleteShipping = deleteShipping;
        this.locateAddress = locateAddress;
        this.findCarrierByName = findCarrierByName;
        this.defaultValueNameCarrier = shipping != null ? shipping.carrier.name : '';
        this.locateSaleOrder = locateSaleOrder;
        this.defaultValueNameSaleOrder = shipping != null ? shipping.order.orderName : '';
        this.locateSaleDeliveryNote = locateSaleDeliveryNote;
        this.tabShipping = tabShipping;
        this.getShippingPackaging = getShippingPackaging;
        this.toggleShippingSent = toggleShippingSent;
        this.documentFunctions = documentFunctions;
        this.getIncoterms = getIncoterms;
        this.getShippingTags = getShippingTags;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getShippingStatusHistory = getShippingStatusHistory;

        this.currentSelectedCustomerId = shipping == null ? null : shipping.order.customerId;
        this.currentSelectedSaleOrder = shipping != null ? shipping.orderId : null;
        this.currentSelectedSaleDeliveryNote = shipping != null ? shipping.deliveryNoteId : null;
        this.currentSelectedShippingAddress = shipping != null ? shipping.deliveryAddressId : null;
        this.currentSelectedCarrierId = shipping != null ? shipping.carrierId : null;
        this.currentSelectedIncotermId = shipping != null ? shipping.incotermId : null;

        this.notes = shipping != null ? shipping.carrierNotes : '';
        this.description = shipping != null ? shipping.description : '';

        this.tab = 0;

        this.saleOrder = React.createRef();
        this.deliveryNote = React.createRef();
        this.shippingAddress = React.createRef();
        this.shippingNumber = React.createRef();
        this.trackingNumber = React.createRef();

        this.tabs = this.tabs.bind(this);
        this.tabPackages = this.tabPackages.bind(this);
        this.tabDescription = this.tabDescription.bind(this);
        this.locateSalesOrder = this.locateSalesOrder.bind(this);
        this.locateSalesDeliveryNote = this.locateSalesDeliveryNote.bind(this);
        this.locateDeliveryAddr = this.locateDeliveryAddr.bind(this);
        this.toggleSent = this.toggleSent.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.tabDocuments = this.tabDocuments.bind(this);
        this.printTags = this.printTags.bind(this);
        this.tabTags = this.tabTags.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    componentDidMount() {
        this.tabs();
        this.tabPackages();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabPackages();
                        break;
                    }
                    case 1: {
                        this.tabDescription();
                        break;
                    }
                    case 2: {
                        this.tabDocuments();
                        break;
                    }
                    case 3: {
                        this.tabTags();
                        break;
                    }
                    case 4: {
                        this.tabShippingHistory();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('packages')} />
                <Tab label={i18next.t('description')} />
                <Tab label={i18next.t('documents')} />
                <Tab label={i18next.t('tags')} />
                {this.shipping != null && this.shipping.sent && this.shipping.collected ? <Tab label={i18next.t('status-history')} /> : null}
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    tabPackages() {
        this.tab = 0;
        this.tabs();
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <ShippingPackages
                shippingId={this.shipping != null ? this.shipping.id : null}
                getShippingPackaging={this.getShippingPackaging}
            />,
            this.refs.render);
    }

    tabDescription() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<ShippingDescription
            notes={this.notes}
            description={this.description}
            incoterm={this.currentSelectedIncotermId}
            getIncoterms={this.getIncoterms}
            setNotes={(notes) => {
                this.notes = notes;
            }}
            setDescription={(description) => {
                this.description = description;
            }}
            setIncoterm={(incoterm) => {
                this.currentSelectedIncotermId = incoterm;
            }}
        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            shippingId={this.shipping == null ? null : this.shipping.id}
            documentFunctions={this.documentFunctions}
        />, this.refs.render);
    }

    tabTags() {
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<ShippingTags
            shippingId={this.shipping != null ? this.shipping.id : null}
            getShippingTags={this.getShippingTags}
        />, this.refs.render);
    }

    tabShippingHistory() {
        this.tab = 4;
        this.tabs();
        ReactDOM.render(<ShippingShippingHistory
            shippingId={this.shipping != null ? this.shipping.id : null}
            getShippingStatusHistory={this.getShippingStatusHistory}
        />, this.refs.render);
    }

    locateSalesOrder() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateSalesOrder
                locateSaleOrder={this.locateSaleOrder}
                handleSelect={(orderId, orderName, customerId) => {
                    this.currentSelectedSaleOrder = orderId;
                    this.currentSelectedCustomerId = customerId;
                    this.saleOrder.current.value = orderName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    locateSalesDeliveryNote() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateSalesDeliveryNote
                orderId={this.currentSelectedSaleOrder}
                locateSaleDeliveryNote={() => {
                    return this.locateSaleDeliveryNote(this.currentSelectedSaleOrder);
                }}
                handleSelect={(noteId, noteName) => {
                    this.currentSelectedSaleDeliveryNote = noteId;
                    this.deliveryNote.current.value = noteName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    locateDeliveryAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.currentSelectedCustomerId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
                    this.shippingAddress.current.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    toggleSent() {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        this.toggleShippingSent(this.shipping.id).then((response) => {
            if (response.ok) {
                this.printTags();
            } else if (response.errorMessage != "" && response.errorMessage != null) {
                ReactDOM.render(<AlertModal
                    modalTitle={"ERROR"}
                    modalText={response.errorMessage}
                />, document.getElementById("renderAddressModal"));
            }
        });
    }

    printTags() {
        return new Promise((resolve) => {
            this.getShippingTags(this.shipping.id).then((labels) => {
                for (let i = 0; i < labels.length; i++) {
                    const temp = atob(labels[i].label);
                    const blob = new Blob([temp], { type: 'application/pdf' });
                    const file = window.URL.createObjectURL(blob);

                    ReactDOM.unmountComponentAtNode(this.refs.renderLabelToPrint);
                    ReactDOM.render(<iframe src={file} id="labelToPrint" name="labelToPrint" style={{ "display": "none" }}>

                    </iframe>, this.refs.renderLabelToPrint);
                    document.getElementById("labelToPrint").contentWindow.print();
                }

                resolve();
            });
        });
    }

    getShippingFromForm() {
        return {
            orderId: this.currentSelectedSaleOrder,
            deliveryNoteId: this.currentSelectedSaleDeliveryNote,
            deliveryAddressId: this.currentSelectedShippingAddress,
            carrierId: this.currentSelectedCarrierId,
            incotermId: this.currentSelectedIncotermId,
            carrierNotes: this.notes,
            description: this.description,
            shippingNumber: this.shippingNumber.current.value,
            trackingNumber: this.trackingNumber.current.value
        }
    }

    add() {
        const shipping = this.getShippingFromForm();

        this.addShipping(shipping).then((ok) => {
            if (ok) {
                this.tabShipping();
            }
        });
    }

    update() {
        const shipping = this.getShippingFromForm();
        shipping.id = this.shipping.id;

        this.updateShipping(shipping).then((ok) => {
            console.log("ok", ok);
            if (ok) {
                this.tabShipping();
            }
        });
    }

    delete() {
        this.deleteShipping(this.shipping.id).then((ok) => {
            if (ok) {
                this.tabShipping();
            }
        });
    }

    transactionLog() {
        if (this.shipping == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"shipping"}
            registerId={this.shipping.id}
        />,
            document.getElementById('renderAddressModal'));
    }

    render() {
        return <div id="tabShipping" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <div ref="renderLabelToPrint">

            </div>
            <h4>{i18next.t('shipping')}</h4>
            {this.shipping != null && this.shipping.sent ? <span class="badge badge-pill badge-primary">{i18next.t('sent')}</span> : null}
            {this.shipping != null && this.shipping.collected ? <span class="badge badge-pill badge-success">{i18next.t('collected')}</span> : null}
            {this.shipping != null && this.shipping.national ? <span class="badge badge-pill badge-danger">{i18next.t('national')}</span> : null}
            <br />
            <br />
            <div class="form-row">
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSalesOrder}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('sale-order')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.saleOrder} defaultValue={this.defaultValueNameSaleOrder} />
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSalesDeliveryNote}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('delivery-note')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.deliveryNote} defaultValue={this.shipping == null ? '' : this.shipping.deliveryNote.deliveryNoteName} />
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateDeliveryAddr}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('shipping-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.shippingAddress} defaultValue={this.shipping == null ? '' : this.shipping.deliveryAddress.address} />
                    </div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <TextField label={i18next.t('shipping-number')} variant="outlined" fullWidth size="small" inputRef={this.shippingNumber}
                        defaultValue={this.shipping != null ? this.shipping.shippingNumber : ''}
                        InputProps={{ readOnly: this.shipping == null || this.shipping.carrierWebService != "_" }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('shipping-number')} variant="outlined" fullWidth size="small" inputRef={this.trackingNumber}
                        defaultValue={this.shipping != null ? this.shipping.trackingNumber : ''}
                        InputProps={{ readOnly: this.shipping == null || this.shipping.carrierWebService != "_" }} />
                </div>
                <div class="col">
                    <div class="form-group">
                        <AutocompleteField findByName={this.findCarrierByName} defaultValueId={this.shipping != null ? this.shipping.carrier : null}
                            defaultValueName={this.defaultValueNameCarrier} valueChanged={(value) => {
                                this.currentSelectedCarrierId = value;
                            }}
                            label={i18next.t('carrier')} />
                    </div>
                </div>
                <div class="col">
                    <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                        defaultValue={this.shipping != null ? window.dateFormat(new Date(this.shipping.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('date-sent')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                        defaultValue={this.shipping != null && this.shipping.dateSent != null ? window.dateFormat(new Date(this.shipping.dateSent)) : ''} />
                </div>
            </div>

            <div ref="tabs" className="mt-2"></div>

            <div ref="render" className="mt-2"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm">
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            {this.shipping != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>

                    {this.shipping == null ? < button type="button" class="btn btn-primary mt-1" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.shipping != null ? <button type="button" class="btn btn-danger mt-1" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    {this.shipping != null ? <button type="button" class="btn btn-success mt-1" onClick={this.update}>{i18next.t('update')}</button> : null}
                    <button type="button" class="btn btn-secondary mt-1" onClick={this.tabShipping}>{i18next.t('cancel')}</button>
                    {this.shipping != null && this.shipping.carrierWebService != "_" && !this.shipping.sent ?
                        <button type="button" class="btn btn-info mt-1" onClick={this.toggleSent}>{i18next.t('generate-tags')}</button> : null}
                    {this.shipping != null && this.shipping.carrierWebService != "_" && this.shipping.sent ?
                        <button type="button" class="btn btn-warning mt-1" onClick={this.printTags}>{i18next.t('print-tags')}</button> : null}
                    {this.shipping != null && this.shipping.carrierWebService == "_" && !this.shipping.sent ?
                        <button type="button" class="btn btn-info mt-1" onClick={this.toggleSent}>{i18next.t('set-as-sent-manual-shipping')}</button> : null}
                    {this.shipping != null && this.shipping.carrierWebService == "_" && this.shipping.sent && !this.shipping.collected ?
                        <button type="button" class="btn btn-warning mt-1" onClick={this.toggleSent}>{i18next.t('set-as-not-sent-manual-shipping')}
                        </button> : null}
                </div>
            </div>

        </div>
    }
}

class ShippingPackages extends Component {
    constructor({ shippingId, getShippingPackaging }) {
        super();

        this.shippingId = shippingId;
        this.getShippingPackaging = getShippingPackaging;


        this.list = [];
    }

    componentDidMount() {
        if (this.shippingId == null) {
            return;
        }

        this.getShippingPackaging(this.shippingId).then((packages) => {
            for (let i = 0; i < packages.length; i++) {
                packages[i].i = i + 1;
            }
            this.list = packages;
            this.forceUpdate();
        });
    }

    render() {
        return <DataGrid
            ref="table"
            autoHeight
            rows={this.list}
            columns={[
                { field: 'i', headerName: '#', width: 200 },
                { field: 'packageName', headerName: i18next.t('package'), flex: 1 },
                { field: 'weight', headerName: i18next.t('weight'), width: 200 },
            ]}
        />
    }
}

class ShippingDescription extends Component {
    constructor({ notes, description, setNotes, setDescription, incoterm, getIncoterms, setIncoterm }) {
        super();

        this.notes = notes;
        this.description = description;
        this.setNotes = setNotes;
        this.setDescription = setDescription;
        this.incoterm = incoterm;
        this.getIncoterms = getIncoterms;
        this.setIncoterm = setIncoterm;
    }

    componentDidMount() {
        this.getIncoterms().then(async (incoterms) => {
            const components = incoterms.map((element, i) => {
                return <option value={element.id} key={i}>{element.key} ({element.name})</option>
            });
            components.unshift(<option value="">.{i18next.t('none')}</option>);
            await ReactDOM.render(components, document.getElementById("render"));

            document.getElementById("render").value = this.incoterm != null ? this.incoterm : "";
        });
    }

    render() {
        return <div className="m-3">
            <FormControl fullWidth>
                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>Incoterm</InputLabel>
                <NativeSelect
                    style={{ 'marginTop': '0' }}
                    id="render"
                    onChange={() => {
                        const incoterm = parseInt(document.getElementById("render").value);
                        this.setIncoterm(incoterm == 0 ? null : incoterm);
                    }}
                >

                </NativeSelect>
            </FormControl>
            <br />
            <br />
            <TextField label={i18next.t('carrier-notes')} variant="outlined" fullWidth size="small"
                defaultValue={this.notes} onChange={(e) => {
                    this.setNotes(e.target.value);
                }} />
            <br />
            <br />
            <TextField label={i18next.t('description')} variant="outlined" fullWidth size="small" defaultValue={this.description}
                multiline maxRows={10} minRows={10} onChange={(e) => {
                    this.setDescription(e.target.value);
                }} />
        </div>
    }
}

class ShippingTags extends Component {
    constructor({ shippingId, getShippingTags }) {
        super();

        this.shippingId = shippingId;
        this.getShippingTags = getShippingTags;

        this.list = [];

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.shippingId == null) {
            return;
        }

        this.getShippingTags(this.shippingId).then((labels) => {
            this.list = labels;
            this.forceUpdate();
        });
    }

    edit(label) {
        const temp = atob(label.label);
        const blob = new Blob([temp], { type: 'application/pdf' });
        const file = window.URL.createObjectURL(blob);

        ReactDOM.unmountComponentAtNode(this.refs.renderLabelToPrint);
        ReactDOM.render(<iframe src={file} id="labelToPrint" name="labelToPrint" style={{ "display": "none" }}>

        </iframe>, this.refs.renderLabelToPrint);
        document.getElementById("labelToPrint").contentWindow.print();
    }

    render() {
        return <div>
            <div ref="renderLabelToPrint">

            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 250 },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), flex: 1, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ShippingShippingHistory extends Component {
    constructor({ shippingId, getShippingStatusHistory }) {
        super();

        this.list = [];

        this.shippingId = shippingId;
        this.getShippingStatusHistory = getShippingStatusHistory;
    }

    componentDidMount() {
        if (this.shippingId == null) {
            return;
        }

        this.getShippingStatusHistory(this.shippingId).then((history) => {
            this.list = history;
            this.forceUpdate();
        });
    }

    render() {
        return <DataGrid
            ref="table"
            autoHeight
            rows={this.list}
            columns={[
                { field: 'statusId', headerName: i18next.t('status-id'), width: 200 },
                { field: 'message', headerName: i18next.t('message'), flex: 1 },
                {
                    field: 'dateCreated', headerName: i18next.t('date'), width: 200, valueGetter: (params) => {
                        return window.dateFormat(params.row.dateCreated)
                    }
                },
                { field: 'delivered', headerName: i18next.t('delivered'), width: 200, type: 'boolean' },
            ]}
            onRowClick={(data) => {
                this.edit(data.row);
            }}
        />
    }
}

export default ShippingForm;
