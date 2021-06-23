import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getLanguages().then((languages) => {
            this.renderLanguages(languages);
        });
    }

    renderLanguages(languages) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(languages.map((element, i) => {
            return <Language key={i}
                language={element}
                edit={this.edit}
            />
        }), this.refs.render);
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
                            this.renderLanguages();
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
                            this.renderLanguages();
                        }
                    });
                    return promise;
                }}
                deleteLanguages={(language) => {
                    const promise = this.deleteLanguages(language);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderLanguages();
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
            <h1>Language</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} />
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">ISO 2</th>
                        <th scope="col">ISO 3</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Language extends Component {
    constructor({ language, edit }) {
        super();

        this.language = language;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.language);
        }}>
            <th scope="row">{this.language.id}</th>
            <td>{this.language.name}</td>
            <td>{this.language.iso2}</td>
            <td>{this.language.iso3}</td>
        </tr>
    }
}

export default Languages;
