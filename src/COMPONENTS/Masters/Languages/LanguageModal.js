import React, { Component } from 'react';
import i18next from 'i18next';


class LanguageModal extends Component {
    constructor({ language, addLanguages, updateLanguages, deleteLanguages }) {
        super();

        this.language = language;
        this.addLanguages = addLanguages;
        this.updateLanguages = updateLanguages;
        this.deleteLanguages = deleteLanguages;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#languageModal').modal({ show: true });
    }

    getLanguageFromForm() {
        const language = {}
        language.name = this.refs.name.value;
        language.iso2 = this.refs.iso2.value;
        language.iso3 = this.refs.iso3.value;
        return language;
    }

    isValid(language) {
        this.refs.errorMessage.innerText = "";
        if (language.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (language.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (language.iso2.length !== 2) {
            this.refs.errorMessage.innerText = i18next.t('iso-2');
            return false;
        }
        if (language.iso3.length !== 3) {
            this.refs.errorMessage.innerText = i18next.t('iso-3');
            return false;
        }
        return true;
    }


    add() {
        const language = this.getLanguageFromForm();
        if (!this.isValid(language)) {
            return;
        }

        this.addLanguages(language).then((ok) => {
            if (ok) {
                window.$('#languageModal').modal('hide');
            }
        });
    }

    update() {
        const language = this.getLanguageFromForm();
        if (!this.isValid(language)) {
            return;
        }
        language.id = this.language.id;

        this.updateLanguages(language).then((ok) => {
            if (ok) {
                window.$('#languageModal').modal('hide');
            }
        });
    }

    delete() {
        const languageId = this.language.id;
        this.deleteLanguages(languageId).then((ok) => {
            if (ok) {
                window.$('#languageModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="languageModal" tabindex="-1" role="dialog" aria-labelledby="languageModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="languageModalLabel">{i18next.t('language')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.language != null ? this.language.name : ''} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>ISO 2</label>
                                <input type="text" class="form-control" ref="iso2" defaultValue={this.language != null ? this.language.iso2 : ''} />
                            </div>
                            <div class="col">
                                <label>ISO 3</label>
                                <input type="text" class="form-control" ref="iso3" defaultValue={this.language != null ? this.language.iso3 : ''} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.language != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.language == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.language != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default LanguageModal;
