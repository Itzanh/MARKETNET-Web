import { Component } from "react";
import ReactDOM from 'react-dom';
import DocumentModal from "./DocumentModal";
import Document from "./Document";

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
        this.getDocuments(JSON.stringify(this.relations)).then((documents) => {
            ReactDOM.render(documents.map((element, i) => {
                return <Document key={i}
                    document={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentsModal'));
        ReactDOM.render(
            <DocumentModal
                addDocuments={this.addDocuments}
                uploadDocument={this.uploadDocument}
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
                deleteDocuments={this.deleteDocuments}
                uploadDocument={this.uploadDocument}
                grantDocumentAccessToken={this.grantDocumentAccessToken}
            />,
            document.getElementById('renderocumentsModal'));
    }

    render() {
        return <div id="tabDocuments" className="formRowRoot">
            <div id="renderocumentsModal"></div>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Date created</th>
                        <th scope="col">Size</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

export default DocumentsTab;