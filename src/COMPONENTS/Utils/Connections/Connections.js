import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class Connections extends Component {
    constructor({ getConnections, disconnectConnection }) {
        super();

        this.getConnections = getConnections;
        this.disconnectConnection = disconnectConnection;

        this.renderConnections = this.renderConnections.bind(this);
    }

    componentDidMount() {
        window.$('#connectionsModal').modal({ show: true });

        this.renderConnections();
    }

    renderConnections() {
        this.getConnections().then((connections) => {
            ReactDOM.render(connections.map((element, i) => {
                return <tr>
                    <th scope="row">{element.id}</th>
                    <td>{element.address}</td>
                    <td>{element.user}</td>
                    <td>{window.dateFormat(element.dateConnected)}</td>
                    <td onClick={() => {
                        this.disconnectConnection(element.id).then((ok) => {
                            if (ok) {
                                this.renderConnections();
                            }
                        })
                    }}>{i18next.t('DELETE')}</td>
                </tr>
            }), this.refs.render);
        });
    }

    render() {
        return <div class="modal fade" id="connectionsModal" tabindex="-1" role="dialog" aria-labelledby="connectionsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="connectionsModalLabel">{i18next.t('connections')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">{i18next.t('address')}</th>
                                    <th scope="col">{i18next.t('user')}</th>
                                    <th scope="col">{i18next.t('date-connected')}</th>
                                    <th scope="col">{i18next.t('delete')}</th>
                                </tr>
                            </thead>
                            <tbody ref="render"></tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onClick={this.renderConnections}>{i18next.t('refresh')}</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Connections;
