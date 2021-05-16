import { Component } from "react";
import ReactDOM from 'react-dom';

class LocateAddress extends Component {
    constructor({ locateAddress, handleSelect }) {
        super();

        this.locateAddress = locateAddress;
        this.handleSelect = handleSelect;

        this.select = this.select.bind(this);
    }

    componentDidMount() {
        window.$('#addressModal').modal({ show: true });

        this.locateAddress().then((addresses) => {
            ReactDOM.render(addresses.map((element, i) => {
                return <LocateAddresAddr key={i}
                    address={element}
                    select={this.select}
                />
            }), this.refs.render);
        });
    }

    select(address) {
        window.$('#addressModal').modal('hide');
        this.handleSelect(address.id, address.address);
    }

    render() {
        return <div class="modal fade" id="addressModal" tabindex="-1" role="dialog" aria-labelledby="addressModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addressModalLabel">Locate Address</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Address</th>
                                </tr>
                            </thead>
                            <tbody ref="render"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    }
}

class LocateAddresAddr extends Component {
    constructor({ address, select }) {
        super();

        this.address = address;
        this.select = select;
    }

    render() {
        return <tr onClick={() => {
            this.select(this.address);
        }}>
            <th scope="row">{this.address.id}</th>
            <td>{this.address.address}</td>
        </tr>
    }
}

export default LocateAddress;
