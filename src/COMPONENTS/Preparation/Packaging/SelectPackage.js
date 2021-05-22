import { Component } from "react";
import ReactDOM from 'react-dom';

class SelectPackage extends Component {
    constructor({ packages, handleSelect }) {
        super();

        this.packages = packages;
        this.handleSelect = handleSelect;

        this.select = this.select.bind(this);
    }

    componentDidMount() {
        window.$('#selectPackageModal').modal({ show: true });
        ReactDOM.render(this.packages.map((element, i) => {
            return <Package key={i}
                _package={element}
                select={this.select}
            />
        }), this.refs.render);
    }

    select(_package) {
        window.$('#selectPackageModal').modal('hide');
        this.handleSelect(_package);
    }

    render() {
        return <div class="modal fade" id="selectPackageModal" tabindex="-1" role="dialog" aria-labelledby="selectPackageModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="selectPackageModalLabel">Select package</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Weight</th>
                                    <th scope="col">Width</th>
                                    <th scope="col">Height</th>
                                    <th scope="col">Depth</th>
                                </tr>
                            </thead>
                            <tbody ref="render"></tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

class Package extends Component {
    constructor({ _package, select }) {
        super();

        this.package = _package;
        this.select = select;
    }

    render() {
        return <tr onClick={() => {
            this.select(this.package);
        }}>
            <th scope="row">{this.package.id}</th>
            <td>{this.package.name}</td>
            <td>{this.package.weight}</td>
            <td>{this.package.width}</td>
            <td>{this.package.height}</td>
            <td>{this.package.depth}</td>
        </tr>
    }
}

export default SelectPackage;
