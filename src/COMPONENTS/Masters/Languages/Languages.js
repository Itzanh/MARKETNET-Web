import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import LanguageModal from './LanguageModal';
import SearchField from '../../SearchField';


class Languages extends Component {
    constructor({ getLanguages, searchLanguages, addLanguages, updateLanguages, deleteLanguages }) {
        super();

        this.getLanguages = getLanguages;
        this.searchLanguages = searchLanguages;
        this.addLanguages = addLanguages;
        this.updateLanguages = updateLanguages;
        this.deleteLanguages = deleteLanguages;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.printLanguages();
    }

    printLanguages() {
        this.getLanguages().then((languages) => {
            this.renderLanguages(languages);
        });
    }

    renderLanguages(languages) {
        this.list = languages;
        this.forceUpdate();
    }

    async search(search) {
        const languages = await this.searchLanguages(search);
        this.renderLanguages(languages);
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderLanguagesModal'));
        ReactDOM.render(
            <LanguageModal
                addLanguages={(language) => {
                    const promise = this.addLanguages(language);
                    promise.then((ok) => {
                        if (ok) {
                            this.printLanguages();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderLanguagesModal'));
    }

    edit(language) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderLanguagesModal'));
        ReactDOM.render(
            <LanguageModal
                language={language}
                updateLanguages={(language) => {
                    const promise = this.updateLanguages(language);
                    promise.then((ok) => {
                        if (ok) {
                            this.printLanguages();
                        }
                    });
                    return promise;
                }}
                deleteLanguages={(language) => {
                    const promise = this.deleteLanguages(language);
                    promise.then((ok) => {
                        if (ok) {
                            this.printLanguages();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderLanguagesModal'));
    }

    render() {
        return <div id="tabLanguage" className="formRowRoot">
            <div id="renderLanguagesModal"></div>
            <h1>{i18next.t('languages')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} />
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'iso2', headerName: 'ISO 2', width: 250 },
                    { field: 'iso3', headerName: 'ISO 3', width: 250 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Languages;
