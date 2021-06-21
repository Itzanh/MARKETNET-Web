import { Component } from "react";
import ReactDOM from 'react-dom';

import FilterWindow from "./FilterWindow";
import SortWindow from "./SortWindow";

class TableContextMenu extends Component {
    constructor({ posX, posY, getList, setList, pos, field, value, fields }) {
        super();

        this.posX = posX;
        this.posY = posY;
        this.getList = getList;
        this.setList = setList;
        this.pos = pos;
        this.field = field;
        this.value = value;
        this.fields = fields;

        this.filter = this.filter.bind(this);
        this.sort = this.sort.bind(this);
        this.sameField = this.sameField.bind(this);
        this.differentField = this.differentField.bind(this);
        this.takeOutRow = this.takeOutRow.bind(this);
        this.copyRow = this.copyRow.bind(this);
    }

    filter() {
        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
        ReactDOM.render(<FilterWindow
            getList={this.getList}
            setList={this.setList}
        />, document.getElementById("contextMenu"));
    }

    sort() {
        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
        ReactDOM.render(<SortWindow
            getList={this.getList}
            setList={this.setList}
        />, document.getElementById("contextMenu"));
    }

    sameField() {
        const list = this.getList();
        const result = list.filter((value) => {
            return value[this.field] == this.value;
        });
        this.setList(result);
        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
    }

    differentField() {
        const list = this.getList();
        const result = list.filter((value) => {
            return value[this.field] != this.value;
        });
        this.setList(result);
        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
    }

    takeOutRow() {
        const list = this.getList();
        list.splice(this.pos, 1);
        this.setList(list);
        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
    }

    copyRow() {
        const list = this.getList();
        const row = list[this.pos];

        var csv = "";
        for (let i = 0; i < this.fields.length; i++) {
            if (i > 0) {
                csv += ";";
            }
            csv += row[this.fields[i]]
        }

        this.refs.csv.style.display = "inherit";
        this.refs.csv.innerText = csv;
        this.refs.csv.focus();
        this.refs.csv.select();
        document.execCommand('copy');
        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
    }

    render() {
        return (
            <div id="customContextMenu" class="dropdown-menu" style={{
                top: this.posY,
                left: this.posX,
                display: "initial"
            }}>
                <a class="dropdown-item" href="#" onClick={this.filter}>Filter window</a>
                <a class="dropdown-item" href="#" onClick={this.sort}>Sorting window</a>
                <a class="dropdown-item" href="#" onClick={this.sameField}>Same as selected column</a>
                <a class="dropdown-item" href="#" onClick={this.differentField}>Different from the selected column</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" onClick={this.takeOutRow}>Take out the selected row</a>
                <a class="dropdown-item" href="#" onClick={this.copyRow}>Copy row</a>
                <textarea ref="csv" style={{ display: "none" }}></textarea>
            </div>
        );
    }
}

export default TableContextMenu;
