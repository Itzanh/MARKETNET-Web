import React, { Component } from 'react';
import i18next from 'i18next';
import AutocompleteField from '../../AutocompleteField';


class CountriesModal extends Component {
    constructor({ country, addCountry, updateCountry, deleteCountry, findLanguagesByName, findCurrencyByName, defaultValueNameLanguage,
        defaultValueNameCurrency }) {
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

    isValid(country) {
        this.refs.errorMessage.innerText = "";
        if (country.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (country.name.length > 75) {
            this.refs.errorMessage.innerText = i18next.t('name-75');
            return false;
        }
        if (country.iso2.length !== 2) {
            this.refs.errorMessage.innerText = i18next.t('iso-2');
            return false;
        }
        if (country.iso3.length !== 3) {
            this.refs.errorMessage.innerText = i18next.t('iso-3');
            return false;
        }
        if (country.unCode <= 0) {
            this.refs.errorMessage.innerText = i18next.t('valid-un-code');
            return false;
        }
        return true;
    }

    add() {
        const country = this.getCountryFromForm();
        if (!this.isValid(country)) {
            return;
        }

        this.addCountry(country).then((ok) => {
            if (ok) {
                window.$('#countryModal').modal('hide');
            }
        });
    }

    update() {
        const country = this.getCountryFromForm();
        country.id = this.country.id;
        if (!this.isValid(country)) {
            return;
        }

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
                        <h5 class="modal-title" id="countryModalLabel">{i18next.t('country')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
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
                                <label>{i18next.t('un-code')}</label>
                                <input type="number" class="form-control" min="0" ref="unCode" defaultValue={this.country != null ? this.country.unCode : '0'} />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('zone')}</label>
                                <select class="form-control" ref="zone" defaultValue={this.country != null ? this.country.zone : 'N'}>
                                    <option value="N">{i18next.t('national')}</option>
                                    <option value="U">{i18next.t('european-union')}</option>
                                    <option value="E">{i18next.t('export')}</option>
                                </select>
                            </div>
                            <div class="col">
                                <label>{i18next.t('phone-prefix')}</label>
                                <input type="number" class="form-control" min="0" ref="phonePrefix"
                                    defaultValue={this.country != null ? this.country.phonePrefix : '0'} />
                            </div>
                        </div>
                        <label>{i18next.t('language')}</label>
                        <AutocompleteField findByName={this.findLanguagesByName} defaultValueId={this.country != null ? this.country.language : null}
                            defaultValueName={this.defaultValueNameLanguage} valueChanged={(value) => {
                                this.currentSelectedLangId = value;
                            }} ref="lang" />
                        <label>{i18next.t('currency')}</label>
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
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.country != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.country == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.country != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default CountriesModal;
