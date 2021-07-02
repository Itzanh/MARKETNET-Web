import { Component } from "react";
import ReactDOM from 'react-dom';

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
                <h1>PrestaShop Zones</h1>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
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
                        <h5 class="modal-title" id="zoneModalLabel">PrestaShop Zone</h5>
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
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.zone != null ? this.zone.name : ''} readOnly={true} />
                        </div>
                        <div class="form-group">
                            <label>Zone</label>
                            <select class="form-control" ref="zone" defaultValue={this.zone != null ? this.zone.zone : 'N'}>
                                <option value="N">National</option>
                                <option value="U">European Union</option>
                                <option value="E">Export</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.zone != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PrestaShopZones;
