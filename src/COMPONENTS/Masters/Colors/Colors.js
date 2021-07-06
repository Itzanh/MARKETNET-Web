import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import ColorsModal from './ColorsModal';


class Colors extends Component {
    constructor({ getColor, addColor, updateColor, deleteColor }) {
        super();

        this.getColor = getColor;
        this.addColor = addColor;
        this.updateColor = updateColor;
        this.deleteColor = deleteColor;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderColors();
    }

    renderColors() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getColor().then((colors) => {
            ReactDOM.render(colors.map((element, i) => {
                return <Color key={i}
                    colors={element}
                    edit={this.edit}
                />
            }), this.refs.render);
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
            <div className="menu">
                <h1>{i18next.t('colors')}</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                        <th scope="col">{i18next.t('hex-color')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Color extends Component {
    constructor({ colors, edit }) {
        super();

        this.colors = colors;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.colors);
        }}>
            <th scope="row">{this.colors.id}</th>
            <td>{this.colors.name}</td>
            <td>{this.colors.hexColor}</td>
        </tr>
    }
}

export default Colors;
