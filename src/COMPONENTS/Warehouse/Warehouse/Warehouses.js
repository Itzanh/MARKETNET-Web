import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import WarehouseModal from './WarehouseModal';


class Warehouses extends Component {
    constructor({ getWarehouses, addWarehouses }) {
        super();

        this.getWarehouses = getWarehouses;
        this.addWarehouses = addWarehouses;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.getWarehouses().then((warehouses) => {
            ReactDOM.render(warehouses.map((element, i) => {
                return <Warehouse key={i}
                    warehouse={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderWarehouseModal'));
        ReactDOM.render(
            <WarehouseModal
                addWarehouses={this.addWarehouses}
            />,
            document.getElementById('renderWarehouseModal'));
    }

    render() {
        return <div id="tabWarehouses">
            <div id="renderWarehouseModal"></div>
            <h1>Warehouses</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Warehouse extends Component {
    constructor({ warehouse, edit }) {
        super();

        this.warehouse = warehouse;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.warehouse);
        }}>
            <th scope="row">{this.warehouse.id}</th>
            <td>{this.warehouse.name}</td>
        </tr>
    }
}

export default Warehouses;
