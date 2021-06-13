import React, { Component } from 'react';
import AutocompleteField from '../../AutocompleteField';


class StatesModal extends Component {
    constructor({ state, findCountryByName, defaultValueNameCountry, addStates, updateStates, deleteStates }) {
        super();

        this.state = state;
        this.addStates = addStates;
        this.updateStates = updateStates;
        this.deleteStates = deleteStates;

        this.currentSelectedCountryId = this.state != null ? this.state.country : "";
        this.findCountryByName = findCountryByName;
        this.defaultValueNameCountry = defaultValueNameCountry;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#stateModal').modal({ show: true });
    }

    getStateFromForm() {
        const city = {}
        city.country = parseInt(this.currentSelectedCountryId);
        city.name = this.refs.name.value;
        city.isoCode = this.refs.isoCode.value;
        return city;
    }

    add() {
        const state = this.getStateFromForm();

        this.addStates(state).then((ok) => {
            if (ok) {
                window.$('#stateModal').modal('hide');
            }
        });
    }

    update() {
        const state = this.getStateFromForm();
        state.id = this.state.id;

        this.updateStates(state).then((ok) => {
            if (ok) {
                window.$('#stateModal').modal('hide');
            }
        });
    }

    delete() {
        const stateId = this.state.id;
        this.deleteStates(stateId).then((ok) => {
            if (ok) {
                window.$('#stateModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="stateModal" tabindex="-1" role="dialog" aria-labelledby="stateModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="stateModalLabel">State</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>Country</label>
                        <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.state != null ? this.state.country : null}
                            defaultValueName={this.defaultValueNameCountry} valueChanged={(value) => {
                                this.currentSelectedCountryId = value;
                            }} />
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.state != null ? this.state.name : ''} />
                        </div>
                        <div class="form-group">
                            <label>ISO Code</label>
                            <input type="text" class="form-control" ref="isoCode" defaultValue={this.state != null ? this.state.isoCode : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.state != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.state == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.state != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default StatesModal;
