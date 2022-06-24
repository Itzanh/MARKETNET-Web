/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import i18next from "i18next";



class Intrastat extends Component {
    constructor({ intrastatReport }) {
        super();

        this.intrastatReport = intrastatReport;

        this.search = this.search.bind(this);
    }

    search() {
        this.intrastatReport({
            dateStart: new Date(this.refs.start.value),
            dateEnd: new Date(this.refs.end.value),
            countryOriginCode: this.refs.countryOriginCode.value,
            stateOriginCode: parseInt(this.refs.stateOriginCode.value),
        }).then((report) => {
            this.refs.salesTxt.value = report.reportSales;
            this.refs.purchasesTxt.value = report.reportPurchase;
        });
    }

    render() {
        return <div className="formRowRoot">
            <h4 className="ml-2">Intrastat</h4>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('origin-country-code')}</label>
                    <input type="text" class="form-control" ref="countryOriginCode" />
                </div>
                <div class="col">
                    <label>{i18next.t('origin-state-code')}</label>
                    <input type="number" class="form-control" ref="stateOriginCode" min="0" defaultValue="0" />
                </div>
                <div class="col">
                    <label for="start">{i18next.t('start-date')}:</label>
                    <br />
                    <input type="date" class="form-control" ref="start" />
                </div>
                <div class="col">
                    <label for="start">{i18next.t('end-date')}:</label>
                    <br />
                    <input type="date" class="form-control" ref="end" />
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.search}>{i18next.t('search')}</button>
                </div>
            </div>
            <br />
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('sales')}</label>
                    <textarea class="form-control" ref="salesTxt" rows="30"></textarea>
                </div>
                <div class="col">
                    <label>{i18next.t('purchases')}</label>
                    <textarea class="form-control" ref="purchasesTxt" rows="30"></textarea>
                </div>
            </div>
        </div>
    }
};



export default Intrastat;
