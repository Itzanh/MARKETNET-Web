import { Component } from "react";

class Document extends Component {
    constructor({ document, edit }) {
        super();

        this.document = document;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.document);
        }}>
            <th scope="row">{this.document.id}</th>
            <td>{this.document.name}</td>
            <td>{window.dateFormat(this.document.dateCreated)}</td>
            <td>{window.bytesToSize(this.document.size)}</td>
        </tr>
    }
}

export default Document;