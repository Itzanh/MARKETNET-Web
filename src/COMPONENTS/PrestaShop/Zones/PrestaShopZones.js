/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class PrestaShopZones extends Component {
    constructor({ getPrestaShopZones, updatePrestaShopZones }) {
        super();

        this.getPrestaShopZones = getPrestaShopZones;
        this.updatePrestaShopZones = updatePrestaShopZones;

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getPrestaShopZones().then((zones) => {
            ReactDOM.render(zones.map((element, i) => {
                return <PrestaShopZone key={i}
                    zone={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    async edit(zone) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderPSZonesModal'));
        ReactDOM.render(
            <PrestaShopZoneModal
                zone={zone}
                updatePrestaShopZones={this.updatePrestaShopZones}
            />,
            document.getElementById('renderPSZonesModal'));
    }

    render() {
        return <div id="tabPSZones">
            <div id="renderPSZonesModal"></div>
            <div className="menu">
                <h1>{i18next.t('prestaShop-zones')}</h1>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class PrestaShopZone extends Component {
    constructor({ zone, edit }) {
        super();

        this.zone = zone;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.zone);
        }}>
            <th scope="row">{this.zone.id}</th>
            <td>{this.zone.name}</td>
        </tr>
    }
}

class PrestaShopZoneModal extends Component {
    constructor({ zone, updatePrestaShopZones }) {
        super();

        this.zone = zone;
        this.updateZone = updatePrestaShopZones;

        this.currentSelectedBillingSerieId = null;

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        window.$('#zoneModal').modal({ show: true });
    }

    update() {
        this.updateZone({
            id: this.zone.id,
            zone: this.refs.zone.value
        }).then((ok) => {
            if (ok) {
                window.$('#zoneModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="zoneModal" tabindex="-1" role="dialog" aria-labelledby="zoneModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="zoneModalLabel">{i18next.t('prestashop-zone')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>ID</label>
                            <input type="text" class="form-control" ref="id" defaultValue={this.zone != null ? this.zone.id : ''} readOnly={true} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.zone != null ? this.zone.name : ''} readOnly={true} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('zone')}</label>
                            <select class="form-control" ref="zone" defaultValue={this.zone != null ? this.zone.zone : 'N'}>
                                <option value="N">{i18next.t('national')}</option>
                                <option value="U">{i18next.t('european-union')}</option>
                                <option value="E">{i18next.t('export')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.zone != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PrestaShopZones;
