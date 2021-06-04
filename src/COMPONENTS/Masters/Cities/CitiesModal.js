import React, { Component } from 'react';
import AutocompleteField from '../../AutocompleteField';


class CitiesModal extends Component {
    constructor({ city, findCountryByName, defaultValueNameCountry, addCity, updateCity, deleteCity }) {
        super();

        this.city = city;
        this.addCity = addCity;
        this.updateCity = updateCity;
        this.deleteCity = deleteCity;

        this.currentSelectedCountryId = this.city != null ? this.city.country : "";
        this.findCountryByName = findCountryByName;
        this.defaultValueNameCountry = defaultValueNameCountry;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#cityModal').modal({ show: true });
    }

    getCityFromForm() {
        const city = {}
        city.country = parseInt(this.currentSelectedCountryId);
        city.name = this.refs.name.value;
        city.nameAscii = this.refs.nameAscii.value;
        city.zipCode = this.refs.zipCode.value;
        return city;
    }

    add() {
        const city = this.getCityFromForm();

        this.addCity(city).then((ok) => {
            if (ok) {
                window.$('#cityModal').modal('hide');
            }
        });
    }

    update() {
        const city = this.getCityFromForm();
        city.id = this.city.id;

        this.updateCity(city).then((ok) => {
            if (ok) {
                window.$('#cityModal').modal('hide');
            }
        });
    }

    delete() {
        const cityId = this.city.id;
        this.deleteCity(cityId).then((ok) => {
            if (ok) {
                window.$('#cityModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="cityModal" tabindex="-1" role="dialog" aria-labelledby="cityModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="cityModalLabel">City</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>Country</label>
                        <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.city != null ? this.city.country : null}
                            defaultValueName={this.defaultValueNameCountry} valueChanged={(value) => {
                                this.currentSelectedCountryId = value;
                            }} />
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.city != null ? this.city.name : ''} />
                        </div>
                        <div class="form-group">
                            <label>Name ASCII</label>
                            <input type="text" class="form-control" ref="nameAscii" defaultValue={this.city != null ? this.city.nameAscii : ''} />
                        </div>
                        <div class="form-group">
                            <label>ZIP Code</label>
                            <input type="text" class="form-control" ref="zipCode" defaultValue={this.city != null ? this.city.zipCode : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.city != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.city == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.city != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default CitiesModal;
