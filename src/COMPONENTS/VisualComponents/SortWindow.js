import { Component } from "react";
import ReactDOM from 'react-dom';

import checkIco from './../../IMG/check.svg';
import timeIco from './../../IMG/time.svg';

class SortWindow extends Component {
    constructor({ tableName, getList, setList }) {
        super();

        this.tableName = tableName;
        this.getList = getList;
        this.setList = setList;
        this.fields = [];
        this.selectedField = null;

        this.sort = this.sort.bind(this);
    }

    componentDidMount() {
        window.$('#sortModal').modal({ show: true });
        this.getFields();
    }

    getFields() {
        const inputList = this.getList();
        const object = inputList[0];
        const fieldNames = Object.keys(object);

        for (let i = 0; i < fieldNames.length; i++) {
            var fieldType = "";
            if (typeof object[fieldNames[i]] == "number") {
                fieldType = "N";
            } else if (typeof object[fieldNames[i]] == "string") {
                fieldType = "S";
            } else if (typeof object[fieldNames[i]] == "boolean") {
                fieldType = "B";
            } else if (typeof object[fieldNames[i]] == "object" && object[fieldNames[i]] instanceof Date) {
                fieldType = "D";
            }

            this.fields.push({
                name: fieldNames[i],
                fieldType
            });
        }
        this.renderFields();
    }

    renderFields() {
        ReactDOM.render(this.fields.map((element, i) => {
            return <tr key={i} className={this.fields[i] == this.selectedField ? "bg-primary" : ""} onClick={() => {
                this.selectedField = this.fields[i];
                this.renderFields();
            }}>
                <td className={"dynamicExporterFieldIcon" +
                    (element.fieldType == "N" ? " dynamicExporterNumber" : (element.fieldType == "S" ? " dynamicExporterAlfa" : ""))}>
                    {element.fieldType == "N" ? "N" : (element.fieldType == "S" ? "A" :
                        (element.fieldType == "B" ? <img src={checkIco} /> : (element.fieldType == "D" ? <img src={timeIco} /> : null)))}
                </td>
                <th scope="row">{this.formatName(element.name)}</th>
            </tr>
        }), this.refs.fields);
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

    sort(ascending) {
        const inputList = this.getList();

        var greaterThan = 1;
        var lessThan = -1;
        if (!ascending) {
            greaterThan = -1;
            lessThan = -1;
        }

        inputList.sort((a, b) => {
            if (a[this.selectedField.name] > b[this.selectedField.name]) {
                return greaterThan;
            } else if (a[this.selectedField.name] < b[this.selectedField.name]) {
                return lessThan;
            } else {
                return 0;
            }
        });

        this.setList(inputList);
        window.$('#sortModal').modal('hide');
    }

    render() {
        return <div class="modal fade" id="sortModal" tabindex="-1" role="dialog" aria-labelledby="sortModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="sortModalLabel">Sort</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="table-wrapper">
                            <div id="table-scroll">
                                <table class="table table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">Type</th>
                                            <th scope="col">#</th>
                                        </tr>
                                    </thead>
                                    <tbody ref="fields"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={() => {
                            this.sort(true);
                        }}>Ascending</button>
                        <button type="button" class="btn btn-primary" onClick={() => {
                            this.sort(false);
                        }}>Descending</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SortWindow;
