import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import ColorsModal from './ColorsModal';


class Colors extends Component {
    constructor({ getColor, addColor, updateColor, deleteColor }) {
        super();

        this.getColor = getColor;
        this.addColor = addColor;
        this.updateColor = updateColor;
        this.deleteColor = deleteColor;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderColors();
    }

    renderColors() {
        this.getColor().then((colors) => {
            this.list = colors;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderColorsModal'));
        ReactDOM.render(
            <ColorsModal
                addColor={(color) => {
                    const promise = this.addColor(color);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderColors();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderColorsModal'));
    }

    edit(color) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderColorsModal'));
        ReactDOM.render(
            <ColorsModal
                color={color}
                updateColor={(color) => {
                    const promise = this.updateColor(color);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderColors();
                        }
                    });
                    return promise;
                }}
                deleteColor={(colorId) => {
                    const promise = this.deleteColor(colorId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderColors();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderColorsModal'));
    }

    render() {
        return <div id="tabColors">
            <div id="renderColorsModal"></div>
            <h1>{i18next.t('colors')}</h1>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'hexColor', headerName: i18next.t('hex-color'), width: 300 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Colors;
