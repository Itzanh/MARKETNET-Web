import { Component } from "react";

class Shippings extends Component {
    constructor({ }) {
        super();

    }

    render() {
        return <div id="tabShippings">
            <h1>Shippings</h1>
            <button type="button" class="btn btn-primary">Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Sale order</th>
                        <th scope="col">Carrier</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    }
}

export default Shippings;
