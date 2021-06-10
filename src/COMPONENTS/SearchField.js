import { Component } from "react";

import arrowDownIco from './../IMG/arrow_down.svg';
import arrowUpIco from './../IMG/arrow_up.svg';

class SearchField extends Component {
    constructor({ handleSearch, handleAdvanced, hasAdvancedSearch }) {
        super();

        this.handleSearch = handleSearch;
        this.handleAdvanced = handleAdvanced;
        this.hasAdvancedSearch = hasAdvancedSearch;
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

    search() {
        this.handleSearch(this.refs.search.value);
    }

    advanced() {
        this.advancedSearch = !this.advancedSearch;
        this.forceUpdate();
        this.handleAdvanced(this.advancedSearch);
    }

    render() {
        return <div className="search">
            <form class="form-inline">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" ref="search" onChange={this.searchChanged} />
                <button class="btn btn-outline-info my-2 my-sm-0" onClick={this.search}>Search</button>
                {this.hasAdvancedSearch && !this.advancedSearch ?
                    <button type="button" class="btn btn-danger"><img src={arrowDownIco} onClick={this.advanced} alt="show advanced search" /></button> : null}
                {this.hasAdvancedSearch && this.advancedSearch ?
                    <button type="button" class="btn btn-danger"><img src={arrowUpIco} onClick={this.advanced} alt="hide advanced search" /></button> : null}
            </form>
        </div>
    }
}

export default SearchField;
