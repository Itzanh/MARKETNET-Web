import { Component } from "react";
import ReactDOM from 'react-dom';

import './../../../CSS/dynamic_exporter.css';

class DynamicImporter extends Component {
    constructor({ tables, importJson }) {
        super();

        this.tables = tables;
        this.importJson = importJson;

        this.fileSelected = this.fileSelected.bind(this);
        this.run = this.run.bind(this);
    }

    componentDidMount() {
        window.$('#dynamicImporterModal').modal({ show: true });

        ReactDOM.render(this.tables.map((element, i) => {
            return <option value={element.name} key={i}>{this.formatName(element.name)}</option>
        }), this.refs.tables);
    }

    formatName(name) {
        name = name.charAt(0).toUpperCase() + name.substring(1);

        for (let i = 0; i < name.length; i++) {
            if (name.charAt(i) == "_") {
                name = this.replaceAt(name, i, " ");
            }
        }

        return name;
    }

    replaceAt(str, index, replacement) {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }

    fileSelected() {
        const files = this.refs.file.files;
        if (files.length === 0) {
            this.refs.fileName.innerText = "Choose file";
        } else {
            this.refs.fileName.innerText = files[0].name;
        }
    }

    readFileAsString() {
        return new Promise((resolve) => {
            const files = this.refs.file.files;
            if (files.length === 0) {
                return;
            }

            var reader = new FileReader();
            reader.onload = function (event) {
                resolve(event.target.result);
            };
            reader.readAsText(files[0]);
        });
    }

    async run() {
        const files = this.refs.file.files;
        if (files.length === 0) {
            return;
        }

        const jsonData = await this.readFileAsString();

        this.importJson({
            tableName: this.refs.tables.value,
            jsonData: jsonData
        }).then((ok) => {
            if (ok === true) {
                window.$('#dynamicImporterModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="dynamicImporterModal" tabindex="-1" role="dialog" aria-labelledby="dynamicImporterModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="dynamicImporterModalLabel">Dynamic importer</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>Table</label>
                        <select class="form-control" ref="tables" onChange={this.renderFields}>

                        </select>
                        <br />
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" ref="file" onChange={this.fileSelected} />
                            <label class="custom-file-label" ref="fileName">Choose file</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.serie == null ? <button type="button" class="btn btn-primary" onClick={this.run}>Run</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default DynamicImporter;
