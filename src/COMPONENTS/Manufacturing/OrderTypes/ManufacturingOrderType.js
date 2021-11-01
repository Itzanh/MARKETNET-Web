import { Component } from "react";

class ManufacturingOrderType extends Component {
    constructor({ type }) {
        super();

        this.type = type;
    }

    render() {
        return <option value={this.type.id}>{this.type.name}</option>
    }
}



export default ManufacturingOrderType;
