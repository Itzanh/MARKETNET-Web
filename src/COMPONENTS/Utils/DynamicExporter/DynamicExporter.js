import { Component } from "react";
import ReactDOM from 'react-dom';

import './../../../CSS/dynamic_exporter.css';

import checkIco from './../../../IMG/check.svg';
import timeIco from './../../../IMG/time.svg';

class DynamicExporter extends Component {
    constructor({ tables, exportAction, exportToJSON }) {
        super();

        this.tables = tables;
        this.exportAction = exportAction;
        this.exportToJSON = exportToJSON;

        this.fields = null;

        this.renderFields = this.renderFields.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.selectNone = this.selectNone.bind(this);
        this.run = this.run.bind(this);
        this.exportJson = this.exportJson.bind(this);
    }

    async componentDidMount() {
        window.$('#dynamicExporterModal').modal({ show: true });

        await ReactDOM.render(this.tables.map((element, i) => {
            return <option value={element.name} key={i}>{this.formatName(element.name)}</option>
        }), this.refs.tables);
        this.renderFields();
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

    renderFields() {
        ReactDOM.unmountComponentAtNode(this.refs.fields);
        const tableName = this.refs.tables.value;
        var table;

        for (let i = 0; i < this.tables.length; i++) {
            if (this.tables[i].name == tableName) {
                table = this.tables[i];
                break;
            }
        }

        if (table == undefined) {
            return;
        }
        this.fields = table.fields;

        ReactDOM.render(table.fields.map((element, i) => {
            if (!element.link) {
                element.link = "I";
            }

            return <tr key={i} className={table.fields[i].selected ? "bg-primary" : ""} onClick={() => {
                table.fields[i].selected = !table.fields[i].selected;
                this.renderFields();
            }}>
                <td className={"dynamicExporterFieldIcon" +
                    (element.fieldType == "N" ? " dynamicExporterNumber" : (element.fieldType == "S" ? " dynamicExporterAlfa" : ""))}>
                    {element.fieldType == "N" ? "N" : (element.fieldType == "S" ? "A" :
                        (element.fieldType == "B" ? <img src={checkIco} /> : (element.fieldType == "D" ? <img src={timeIco} /> : null)))}
                </td>
                <th scope="row">{this.formatName(element.name)}</th>
                <td>{!element.isForeignKey ? null :
                    <div class="btn-group btn-group-toggle" data-toggle="buttons" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <label class={"btn btn-secondary" + (element.link == "I" ? " active" : "")} onClick={() => {
                            table.fields[i].link = "I";
                            this.renderFields();
                        }}>
                            <input type="radio" name="options" />ID
                        </label>
                        <label class={"btn btn-secondary" + (element.link == "N" ? " active" : "")} onClick={() => {
                            table.fields[i].link = "N";
                            this.renderFields();
                        }}>
                            <input type="radio" name="options" />Name
                        </label>
                    </div>
                }</td>
            </tr>
        }), this.refs.fields);
    }

    selectAll() {
        for (let i = 0; i < this.fields.length; i++) {
            this.fields[i].selected = true;
        }
        this.renderFields();
    }

    selectNone() {
        for (let i = 0; i < this.fields.length; i++) {
            this.fields[i].selected = false;
        }
        this.renderFields();
    }

    run() {
        const exportInfo = {};
        exportInfo.table = this.refs.tables.value;
        if (this.refs.tab.checked) {
            exportInfo.separator = "\t";
        } else {
            exportInfo.separator = this.refs.separator.value;
        }
        if (this.refs.crlf) {
            exportInfo.newLine = "CRLF";
        } else if (this.refs.cr) {
            exportInfo.newLine = "CR";
        } else if (this.refs.lf) {
            exportInfo.newLine = "LF";
        }

        exportInfo.fields = [];

        for (let i = 0; i < this.fields.length; i++) {
            if (this.fields[i].selected) {
                const field = { name: this.fields[i].name };
                if (this.fields[i].isForeignKey) {
                    field.relation = this.fields[i].link;
                }
                exportInfo.fields.push(field);
            }
        }

        this.exportAction(exportInfo).then((fileId) => {
            window.open("http://" + window.location.hostname + ":12279/export?uuid_csv=" + fileId, '_blank');
        });
    }

    exportJson() {
        this.exportToJSON(this.refs.tables.value).then((fileId) => {
            window.open("http://" + window.location.hostname + ":12279/export?uuid_json=" + fileId, '_blank');
        });
    }

    render() {
        return <div class="modal fade" id="dynamicExporterModal" tabindex="-1" role="dialog" aria-labelledby="dynamicExporterModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="dynamicExporterModalLabel">Dynamic exporter</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>Table</label>
                        <select class="form-control" ref="tables" onChange={this.renderFields}>

                        </select>
                        <button type="button" class="btn btn-info" onClick={this.selectAll}>Select all</button>
                        <button type="button" class="btn btn-info" onClick={this.selectNone}>Select none</button>
                        <div id="table-wrapper">
                            <div id="table-scroll">
                                <table class="table table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">Type</th>
                                            <th scope="col">#</th>
                                            <th scope="col">Link</th>
                                        </tr>
                                    </thead>
                                    <tbody ref="fields"></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <p>Separator</p>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="separator" value="tab" ref="tab" />
                                    <label class="form-check-label">
                                        Tab
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="separator" value="other" defaultChecked={true} ref="se" />
                                    <label class="form-check-label">
                                        Other
                                    </label>
                                </div>
                                <input type="text" class="form-control" defaultValue=";" ref="separator" />
                            </div>
                            <div class="col">
                                <p>New line format</p>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="new-line" value="crlf" defaultChecked={true} ref="crlf" />
                                    <label class="form-check-label">
                                        CRLF
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="new-line" value="cr" ref="cr" />
                                    <label class="form-check-label">
                                        CR
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="new-line" value="lf" ref="lf" />
                                    <label class="form-check-label">
                                        LF
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onClick={this.exportJson}>Export all fields to JSON</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={this.run}>Run</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default DynamicExporter;
