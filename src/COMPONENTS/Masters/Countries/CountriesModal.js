import React, { Component } from 'react';
import AutocompleteField from '../../AutocompleteField';


class CountriesModal extends Component {
    constructor({ country, addCountry, updateCountry, deleteCountry, findLanguagesByName, findCurrencyByName, defaultValueNameLanguage, defaultValueNameCurrency }) {
        super();

        this.country = country;
        this.addCountry = addCountry;
        this.updateCountry = updateCountry;
        this.deleteCountry = deleteCountry;

        this.findLanguagesByName = findLanguagesByName;
        this.findCurrencyByName = findCurrencyByName;
        this.currentSelectedLangId = country != null ? country.language : "";
        this.currentSelectedCurrencyId = country != null ? country.currency : "";
        this.defaultValueNameLanguage = defaultValueNameLanguage;
        this.defaultValueNameCurrency = defaultValueNameCurrency;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#countryModal').modal({ show: true });
    }

    getCountryFromForm() {
        const country = {}
        country.name = this.refs.name.value;
        country.iso2 = this.refs.iso2.value;
        country.iso3 = this.refs.iso3.value;
        country.unCode = parseInt(this.refs.unCode.value);
        country.zone = this.refs.zone.value;
        country.phonePrefix = parseInt(this.refs.phonePrefix.value);
        country.language = parseInt(this.currentSelectedLangId);
        country.currency = parseInt(this.currentSelectedCurrencyId);
        return country;
    }

    add() {
        const country = this.getCountryFromForm();

        this.addCountry(country).then((ok) => {
            if (ok) {
                window.$('#countryModal').modal('hide');
            }
        });
    }

    update() {
        const country = this.getCountryFromForm();
        country.id = this.country.id;

        this.updateCountry(country).then((ok) => {
            if (ok) {
                window.$('#countryModal').modal('hide');
            }
        });
    }

    delete() {
        const countryId = this.country.id;
        this.deleteCountry(countryId).then((ok) => {
            if (ok) {
                window.$('#countryModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="countryModal" tabindex="-1" role="dialog" aria-labelledby="countryModallLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="countryModalLabel">Country</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.country != null ? this.country.name : ''} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>ISO 2</label>
                                <input type="text" class="form-control" ref="iso2" defaultValue={this.country != null ? this.country.iso2 : ''} />
                            </div>
                            <div class="col">
                                <label>ISO 3</label>
                                <input type="text" class="form-control" ref="iso3" defaultValue={this.country != null ? this.country.iso3 : ''} />
                            </div>
                            <div class="col">
                                <label>UN Code</label>
                                <input type="number" class="form-control" ref="unCode" defaultValue={this.country != null ? this.country.unCode : '0'} />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>Zone</label>
                                <select class="form-control" ref="zone" defaultValue={this.country != null ? this.country.zone : 'N'}>
                                    <option value="N">National</option>
                                    <option value="U">European Union</option>
                                    <option value="E">Export</option>
                                </select>
                            </div>
                            <div class="col">
                                <label>Phone Prefix</label>
                                <input type="number" class="form-control" ref="phonePrefix" defaultValue={this.country != null ? this.country.phonePrefix : '0'} />
                            </div>
                        </div>
                        <label>Language</label>
                        <AutocompleteField findByName={this.findLanguagesByName} defaultValueId={this.country != null ? this.country.language : null}
                            defaultValueName={this.defaultValueNameLanguage} valueChanged={(value) => {
                                this.currentSelectedLangId = value;
                            }} ref="lang" />
                        <label>Currency</label>
                        <AutocompleteField findByName={this.findCurrencyByName} defaultValueId={this.country != null ? this.country.currency : null}
                            defaultValueName={this.defaultValueNameCurrency} valueChanged={(value) => {
                                this.currentSelectedCurrencyId = value;
                            }} />
                        <div class="form-row">
                            <div class="col">
                            </div>
                            <div class="col">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.country != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.country == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.country != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default CountriesModal;
