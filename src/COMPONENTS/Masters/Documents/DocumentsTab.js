/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import DocumentModal from "./DocumentModal";
import { DataGrid } from '@material-ui/data-grid';



class DocumentsTab extends Component {
    constructor({ documentFunctions, saleOrderId, saleInvoiceId, saleDeliveryNoteId, purchaseOrderId, purchaseInvoiceId, purchaseDeliveryNoteId, shippingId }) {
        super();

        this.getDocuments = documentFunctions.getDocuments;
        this.addDocuments = documentFunctions.addDocuments;
        this.deleteDocuments = documentFunctions.deleteDocuments;
        this.uploadDocument = documentFunctions.uploadDocument;
        this.grantDocumentAccessToken = documentFunctions.grantDocumentAccessToken;
        this.locateDocumentContainers = documentFunctions.locateDocumentContainers;
        this.saleOrderId = saleOrderId;
        this.saleInvoiceId = saleInvoiceId;
        this.saleDeliveryNoteId = saleDeliveryNoteId;
        this.purchaseOrderId = purchaseOrderId;
        this.purchaseInvoiceId = purchaseInvoiceId;
        this.purchaseDeliveryNoteId = purchaseDeliveryNoteId;
        this.shippingId = shippingId;

        this.list = [];

        this.relations = {
            "salesOrder": this.saleOrderId,
            "salesInvoice": this.saleInvoiceId,
            "salesDeliveryNote": this.saleDeliveryNoteId,
            "purchaseOrder": this.purchaseOrderId,
            "purchaseInvoice": this.purchaseInvoiceId,
            "purchaseDeliveryNote": this.purchaseDeliveryNoteId,
            "shipping": this.shippingId
        };

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderDocumentsTab();
    }

    renderDocumentsTab() {
        this.getDocuments(JSON.stringify(this.relations)).then((documents) => {
            this.list = documents;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentsModal'));
        ReactDOM.render(
            <DocumentModal
                addDocuments={(doc) => {
                    const promise = this.addDocuments(doc);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentsTab();
                        }
                    });
                    return promise;
                }}
                uploadDocument={(uuid, token, file) => {
                    const promise = this.uploadDocument(uuid, token, file);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentsTab();
                        }
                    });
                    return promise;
                }}
                grantDocumentAccessToken={this.grantDocumentAccessToken}
                locateDocumentContainers={this.locateDocumentContainers}
                relations={this.relations}
            />,
            document.getElementById('renderocumentsModal'));
    }

    edit(doc) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentsModal'));
        ReactDOM.render(
            <DocumentModal
                document={doc}
                deleteDocuments={(docId) => {
                    const promise = this.deleteDocuments(docId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentsTab();
                        }
                    });
                    return promise;
                }}
                uploadDocument={(uuid, token, file) => {
                    const promise = this.uploadDocument(uuid, token, file);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentsTab();
                        }
                    });
                    return promise;
                }}
                grantDocumentAccessToken={this.grantDocumentAccessToken}
            />,
            document.getElementById('renderocumentsModal'));
    }

    render() {
        return <div id="tabDocuments" className="formRowRoot">
            <div id="renderocumentsModal"></div>
            <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    {
                        field: 'size', headerName: i18next.t('size'), width: 150, valueGetter: (params) => {
                            return window.bytesToSize(params.row.size)
                        }
                    },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}



export default DocumentsTab;
