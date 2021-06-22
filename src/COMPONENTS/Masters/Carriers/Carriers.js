import { Component } from "react";
import ReactDOM from 'react-dom';

class Carriers extends Component {
    constructor({ getCarriers, addCarrier, updateCarrier, deleteCarrier }) {
        super();

        this.getCarriers = getCarriers;
        this.addCarrier = addCarrier;
        this.updateCarrier = updateCarrier;
        this.deleteCarrier = deleteCarrier;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderCarriers();
    }

    renderCarriers() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getCarriers().then((carriers) => {
            ReactDOM.render(carriers.map((element, i) => {
                return <Carrier key={i}
                    carrier={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCarrierModal'));
        ReactDOM.render(
            <CarriersModal
                addCarrier={(carrier) => {
                    const promise = this.addCarrier(carrier);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCarriers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCarrierModal'));
    }

    edit(carrier) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCarrierModal'));
        ReactDOM.render(
            <CarriersModal
                carrier={carrier}
                updateCarrier={(carrier) => {
                    const promise = this.updateCarrier(carrier);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCarriers();
                        }
                    });
                    return promise;
                }}
                deleteCarrier={(carrierId) => {
                    const promise = this.deleteCarrier(carrierId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCarriers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCarrierModal'));
    }

    render() {
        return <div id="tabCarriers">
            <div id="renderCarrierModal"></div>
            <h1>Carriers</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Web</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Carrier extends Component {
    constructor({ carrier, edit }) {
        super();

        this.carrier = carrier;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.carrier);
        }}>
            <th scope="row">{this.carrier.id}</th>
            <td>{this.carrier.name}</td>
            <td>{this.carrier.email}</td>
            <td>{this.carrier.web}</td>
        </tr>
    }
}

class CarriersModal extends Component {
    constructor({ carrier, addCarrier, updateCarrier, deleteCarrier }) {
        super();

        this.carrier = carrier;
        this.addCarrier = addCarrier;
        this.updateCarrier = updateCarrier;
        this.deleteCarrier = deleteCarrier;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#carrierModal').modal({ show: true });
    }

    getCarrierFromForm() {
        const carrier = {};
        carrier.name = this.refs.name.value;
        carrier.maxWeight = parseFloat(this.refs.maxWeight.value);
        carrier.maxWidth = parseFloat(this.refs.maxWidth.value);
        carrier.maxHeight = parseFloat(this.refs.maxHeight.value);
        carrier.maxDepth = parseFloat(this.refs.maxDepth.value);
        carrier.maxPackages = parseInt(this.refs.maxPackages.value);
        carrier.phone = this.refs.phone.value;
        carrier.email = this.refs.email.value;
        carrier.web = this.refs.web.value;
        carrier.pallets = this.refs.pallets.checked;
        return carrier;
    }

    isValid(country) {
        this.refs.errorMessage.innerText = "";
        if (country.name.length === 0) {
            this.refs.errorMessage.innerText = "The name can't be empty.";
            return false;
        }
        if (country.name.length > 50) {
            this.refs.errorMessage.innerText = "The name can't be longer than 50 characters.";
            return false;
        }
        if (country.phone.length > 15) {
            this.refs.errorMessage.innerText = "The phone can't be longer than 15 characters.";
            return false;
        }
        if (country.email.length > 100) {
            this.refs.errorMessage.innerText = "The email can't be longer than 100 characters.";
            return false;
        }
        if (country.web.length > 100) {
            this.refs.errorMessage.innerText = "The web can't be longer than 100 characters.";
            return false;
        }
        return true;
    }

    add() {
        const carrier = this.getCarrierFromForm();
        if (!this.isValid(carrier)) {
            return;
        }

        this.addCarrier(carrier).then((ok) => {
            if (ok) {
                window.$('#carrierModal').modal('hide');
            }
        });
    }

    update() {
        const carrier = this.getCarrierFromForm();
        if (!this.isValid(carrier)) {
            return;
        }
        carrier.id = this.carrier.id;

        this.updateCarrier(carrier).then((ok) => {
            if (ok) {
                window.$('#carrierModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteCarrier(this.carrier.id).then((ok) => {
            if (ok) {
                window.$('#carrierModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="carrierModal" tabindex="-1" role="dialog" aria-labelledby="carrierModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="carrierModalLabel">Carriers</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.carrier != null ? this.carrier.name : ''} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>Max Weight</label>
                                <input type="number" class="form-control" min="0" ref="maxWeight"
                                    defaultValue={this.carrier != null ? this.carrier.maxWeight : '0'} />
                            </div>
                            <div class="col">
                                <label>Max Width</label>
                                <input type="number" class="form-control" min="0" ref="maxWidth"
                                    defaultValue={this.carrier != null ? this.carrier.maxWidth : '0'} />
                            </div>
                            <div class="col">
                                <label>Max Height</label>
                                <input type="number" class="form-control" min="0" ref="maxHeight"
                                    defaultValue={this.carrier != null ? this.carrier.maxHeight : '0'} />
                            </div>
                            <div class="col">
                                <label>Max Depth</label>
                                <input type="number" class="form-control" min="0" ref="maxDepth"
                                    defaultValue={this.carrier != null ? this.carrier.maxDepth : '0'} />
                            </div>
                            <div class="col">
                                <label>Max Packages</label>
                                <input type="number" class="form-control" min="0" ref="maxPackages"
                                    defaultValue={this.carrier != null ? this.carrier.maxPackages : '0'} />
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-row">
                                <div class="col">
                                    <label>Phone</label>
                                    <input type="text" class="form-control" ref="phone" defaultValue={this.carrier != null ? this.carrier.phone : ''} />
                                </div>
                                <div class="col">
                                    <input class="form-check-input" type="checkbox" ref="pallets"
                                        defaultChecked={this.carrier !== undefined && this.carrier.pallets} />
                                    <label class="form-check-label">Pallets</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="text" class="form-control" ref="email" defaultValue={this.carrier != null ? this.carrier.email : ''} />
                        </div>
                        <div class="form-group">
                            <label>Web</label>
                            <input type="text" class="form-control" ref="web" defaultValue={this.carrier != null ? this.carrier.web : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.carrier != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.carrier == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.carrier != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Carriers;
