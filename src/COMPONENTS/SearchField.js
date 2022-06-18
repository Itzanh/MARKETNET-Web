import { Component } from "react";
import i18next from 'i18next';

import arrowDownIco from './../IMG/arrow_down.svg';
import arrowUpIco from './../IMG/arrow_up.svg';

class SearchField extends Component {
    constructor({ handleSearch, handleAdvanced, hasAdvancedSearch, defaultSearchValue }) {
        super();

        this.handleSearch = handleSearch;
        this.handleAdvanced = handleAdvanced;
        this.hasAdvancedSearch = hasAdvancedSearch;
        this.defaultSearchValue = defaultSearchValue;
        this.timer = null;
        this.advancedSearch = false;

        this.searchChanged = this.searchChanged.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    searchChanged() {
        if (this.timer != null) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        this.timer = setTimeout(() => {
            this.timer = null;
            this.search();
        }, 400);
    }

    search(e) {
        if (e != null) {
            e.preventDefault();
        }

        if (this.refs.search != null) {
            this.handleSearch(this.refs.search.value);
        }
    }

    advanced() {
        this.advancedSearch = !this.advancedSearch;
        this.forceUpdate();
        this.handleAdvanced(this.advancedSearch);
    }

    render() {
        return <div className="seachContainer">
            <div className="search">
                <form class="form-inline">
                    <input class="form-control mr-sm-2" placeholder={i18next.t('search')} ref="search" onChange={this.searchChanged}
                        defaultValue={this.defaultSearchValue} />
                    <button class="btn btn-outline-info" onClick={this.search}>{i18next.t('search')}</button>
                    {this.hasAdvancedSearch && !this.advancedSearch ?
                        <button type="button" class="btn btn-danger"><img src={arrowDownIco} onClick={this.advanced} alt="show advanced search" /></button> : null}
                    {this.hasAdvancedSearch && this.advancedSearch ?
                        <button type="button" class="btn btn-danger"><img src={arrowUpIco} onClick={this.advanced} alt="hide advanced search" /></button> : null}
                </form>
            </div>
        </div>
    }
}

export default SearchField;
