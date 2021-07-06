import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import './../../CSS/list_functions.css';

import checkIco from './../../IMG/check.svg';
import timeIco from './../../IMG/time.svg';

class FilterWindow extends Component {
    constructor({ getList, setList }) {
        super();

        this.getList = getList;
        this.setList = setList;
        this.fields = [];
        this.selectedField = null;
        this.filters = [];

        this.addFilter = this.addFilter.bind(this);
        this.run = this.run.bind(this);
    }

    componentDidMount() {
        window.$('#filterModal').modal({ show: true });
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
                this.renderFiler();
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

    renderFiler() {
        ReactDOM.unmountComponentAtNode(this.refs.filter);
        if (this.selectedField == null) {
            return;
        }

        if (this.selectedField.fieldType == "N") { // Numeric
            ReactDOM.render(<this.componentFilterNumber />, this.refs.filter);
        } else if (this.selectedField.fieldType == "S") { // String
            ReactDOM.render(<this.componentFilterAlfa />, this.refs.filter);
        } else if (this.selectedField.fieldType == "B") { // Boolean
            ReactDOM.render(<this.componentFilterBoolean />, this.refs.filter);
        } else if (this.selectedField.fieldType == "D") { // DateTime
            ReactDOM.render(<this.componentFilterDate />, this.refs.filter);
        }
    }

    componentFilterNumber() {
        return (<div class="form-row">
            <div class="col">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="numberFilter" value="==" defaultChecked={true} />
                    <label class="form-check-label">
                        {i18next.t('equal-to')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="numberFilter" value="!=" />
                    <label class="form-check-label">
                        {i18next.t('different-to')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="numberFilter" value=">" />
                    <label class="form-check-label">
                        {i18next.t('greater-than')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="numberFilter" value="<" />
                    <label class="form-check-label">
                        {i18next.t('less-than')}
                    </label>
                </div>
            </div>
            <div class="col">
                <label>{i18next.t('value')}</label>
                <input type="number" class="form-control" defaultValue="0" id="value" />
            </div>
        </div>)
    }

    componentFilterAlfa() {
        return (<div class="form-row">
            <div class="col">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="alfaFilter" value="==" defaultChecked={true} />
                    <label class="form-check-label">
                        {i18next.t('equal-to')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="alfaFilter" value="!=" />
                    <label class="form-check-label">
                        {i18next.t('different-to')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="alfaFilter" value=">>" />
                    <label class="form-check-label">
                        {i18next.t('contains')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="alfaFilter" value="<<" />
                    <label class="form-check-label">
                        {i18next.t('does-not-contain')}
                    </label>
                </div>
            </div>
            <div class="col">
                <label>{i18next.t('value')}</label>
                <input type="text" class="form-control" id="value" />
            </div>
        </div>)
    }

    componentFilterDate() {
        return (<div class="form-row">
            <div class="col">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="dateFilter" value="==" defaultChecked={true} />
                    <label class="form-check-label">
                        {i18next.t('equal-to')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="dateFilter" value="<" />
                    <label class="form-check-label">
                        {i18next.t('before')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="dateFilter" value=">" />
                    <label class="form-check-label">
                        {i18next.t('after')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="dateFilter" value="<>" />
                    <label class="form-check-label">
                        {i18next.t('between')}
                    </label>
                </div>
            </div>
            <div class="col">
                <label for="start">{i18next.t('start-date')}:</label>
                <br />
                <div class="form-row">
                    <div class="col">
                        <input type="date" class="form-control" id="startDate" />
                    </div>
                    <div class="col">
                        <input type="time" class="form-control" id="startTime" defaultValue="00:00" />
                    </div>
                </div>
                <label for="start">{i18next.t('end-date')}:</label>
                <br />
                <div class="form-row">
                    <div class="col">
                        <input type="date" class="form-control" id="endDate" />
                    </div>
                    <div class="col">
                        <input type="time" class="form-control" id="endTime" defaultValue="23:59" />
                    </div>
                </div>
            </div>
        </div>)
    }

    componentFilterBoolean() {
        return (<div class="form-row">
            <div class="col">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="boolFilter" value="1" defaultChecked={true} />
                    <label class="form-check-label">
                        {i18next.t('true')}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="boolFilter" value="0" />
                    <label class="form-check-label">
                        {i18next.t('false')}
                    </label>
                </div>
            </div>
        </div>)
    }

    addFilter() {
        if (this.selectedField == null) {
            return;
        }

        const filter = {
            fieldName: this.selectedField.name,
            fieldType: this.selectedField.fieldType
        };
        if (this.selectedField.fieldType == "N") { // Numeric
            filter.mode = this.getValueByName('numberFilter');
            filter.value = parseFloat(document.getElementById("value").value);
        } else if (this.selectedField.fieldType == "S") { // String
            filter.mode = this.getValueByName('alfaFilter');
            filter.value = document.getElementById("value").value;
        } else if (this.selectedField.fieldType == "B") { // Boolean
            filter.mode = this.getValueByName('boolFilter');
        } else if (this.selectedField.fieldType == "D") { // DateTime
            filter.mode = this.getValueByName('dateFilter');
            const startDate = document.getElementById("startDate").value;
            const startTime = document.getElementById("startTime").value;
            if (startDate == "" || startTime == "") {
                return;
            }
            filter.value = new Date(startDate + " " + startTime);
            if (filter.mode == "<>") {
                const endDate = document.getElementById("endDate").value;
                const endTime = document.getElementById("endTime").value;
                if (endDate == "" || endTime == "") {
                    return;
                }
                filter.value2 = new Date(endDate + " " + endTime);
            }
        }

        this.filters.push(filter);
        this.renderFilters();
    }

    getValueByName(radioName) {
        const radios = document.getElementsByName(radioName);

        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }

        return "";
    }

    renderFilters() {
        ReactDOM.unmountComponentAtNode(this.refs.filters);
        ReactDOM.render(this.filters.map((element, i) => {
            return <div class="card" key={i}>
                <div class="card-body">
                    <h5 class="card-title">{this.formatName(element.fieldName)}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{element.mode} {element.fieldType == "D" ? window.dateFormat(element.value) : element.value}
                        {element.fieldType == "D" && element.mode == "<>" ? " " + window.dateFormat(element.value2) : ""}</h6>
                    <a href="#" class="card-link" onClick={() => {
                        this.filters = this.filters.filter((value, index) => {
                            return index != i;
                        });
                        this.renderFilters();
                    }}>{i18next.t('remove-filter')}</a>
                </div>
            </div>
        }), this.refs.filters);
    }

    run() {
        const inputList = this.getList();
        const outputList = [];

        for (let i = 0; i < inputList.length; i++) {
            if (this.runFilters(inputList[i])) {
                outputList.push(inputList[i]);
            }
        }

        this.setList(outputList);
        window.$('#filterModal').modal('hide');
    }

    runFilters(row) {
        for (let i = 0; i < this.filters.length; i++) {
            var ok = this.runFilter(this.filters[i], row[this.filters[i].fieldName]);
            if (!ok) {
                return false;
            }
        }
        return true;
    }

    runFilter(filter, element) {
        if (filter.fieldType == "N") { // Number
            if (filter.mode == "==") {
                return element == filter.value;
            } else if (filter.mode == "!=") {
                return element != filter.value;
            } else if (filter.mode == ">") {
                return element > filter.value;
            } else if (filter.mode == "<") {
                return element < filter.value;
            }
        } else if (filter.fieldType == "S") { // String
            if (filter.mode == "==") {
                return element == filter.value;
            } else if (filter.mode == "!=") {
                return element != filter.value;
            } else if (filter.mode == ">>") {
                return element.includes(filter.value);
            } else if (filter.mode == "<<") {
                return !element.includes(filter.value);
            }
        } else if (filter.fieldType == "B") { // Boolean
            if (filter.mode == "1") {
                return element == true;
            } else if (filter.mode == "0") {
                return element == false;
            }
        } else if (filter.fieldType == "D") { // DateTime
            if (filter.mode == "==") {
                return element == filter.value;
            } else if (filter.mode == "<") {
                return element < filter.value;
            } else if (filter.mode == ">") {
                return element > filter.value;
            } else if (filter.mode == "<>") {
                return element > filter.value && element < filter.value2;
            }
        }
    }

    render() {
        return <div class="modal fade" id="filterModal" tabindex="-1" role="dialog" aria-labelledby="filterModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="filterModalLabel">{i18next.t('filter')}</h5>
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
                                            <th scope="col">{i18next.t('type')}</th>
                                            <th scope="col">#</th>
                                        </tr>
                                    </thead>
                                    <tbody ref="fields"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div ref="filter"></div>
                    <div class="form-row bottomFilterWindow">
                        <div class="col">
                            <button type="button" class="btn btn-primary" onClick={this.addFilter}>{i18next.t('add-filter')}</button>
                        </div>
                        <div class="col">
                            <div class="card-deck" ref="filters">

                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        <button type="button" class="btn btn-primary" onClick={this.run}>{i18next.t('run')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default FilterWindow;
