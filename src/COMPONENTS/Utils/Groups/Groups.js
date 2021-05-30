import { Component } from "react";
import ReactDOM from 'react-dom';

class Groups extends Component {
    constructor({ getGroups, addGroup, updateGroup, deleteGroup }) {
        super();

        this.getGroups = getGroups;
        this.addGroup = addGroup;
        this.updateGroup = updateGroup;
        this.deleteGroup = deleteGroup;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.getGroups().then((groups) => {
            ReactDOM.render(groups.map((element, i) => {
                return <Group key={i}
                    group={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderGroupsModal'));
        ReactDOM.render(
            <GroupModal
                addGroup={this.addGroup}
            />,
            document.getElementById('renderGroupsModal'));
    }

    edit(group) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderGroupsModal'));
        ReactDOM.render(
            <GroupModal
                group={group}
                updateGroup={this.updateGroup}
                deleteGroup={this.deleteGroup}
            />,
            document.getElementById('renderGroupsModal'));
    }

    render() {
        return <div id="tabGroups">
            <div id="renderGroupsModal"></div>
            <h1>Groups</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
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

class Group extends Component {
    constructor({ group, edit }) {
        super();

        this.group = group;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.group);
        }}>
            <th scope="row">{this.group.id}</th>
            <td>{this.group.name}</td>
        </tr>
    }
}

class GroupModal extends Component {
    constructor({ group, addGroup, updateGroup, deleteGroup }) {
        super();

        this.group = group;
        this.addGroup = addGroup;
        this.updateGroup = updateGroup;
        this.deleteGroup = deleteGroup;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#groupModal').modal({ show: true });
    }

    getGroupFromForm() {
        const group = {}
        group.name = this.refs.name.value;
        group.sales = this.refs.sales.checked;
        group.purchases = this.refs.purchases.checked;
        group.masters = this.refs.masters.checked;
        group.warehouse = this.refs.warehouse.checked;
        group.manufacturing = this.refs.manufacturing.checked;
        group.preparation = this.refs.preparation.checked;
        group.admin = this.refs.admin.checked;
        return group;
    }

    add() {
        const group = this.getGroupFromForm();

        this.addGroup(group).then((ok) => {
            if (ok) {
                window.$('#groupModal').modal('hide');
            }
        });
    }

    update() {
        const group = this.getGroupFromForm();
        group.id = this.group.id;

        this.updateGroup(group).then((ok) => {
            if (ok) {
                window.$('#groupModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteGroup(this.group.id).then((ok) => {
            if (ok) {
                window.$('#groupModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="groupModal" tabindex="-1" role="dialog" aria-labelledby="groupModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="groupModalLabel">Group</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.group != null ? this.group.name : ''} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <input class="form-check-input" type="checkbox" ref="sales"
                                    defaultChecked={this.group != null && this.group.sales} />
                                <label class="form-check-label">Sales</label>
                            </div>
                            <div class="col">
                                <input class="form-check-input" type="checkbox" ref="purchases"
                                    defaultChecked={this.group != null && this.group.purchases} />
                                <label class="form-check-label">Purchases</label>
                            </div>
                            <div class="col">
                                <input class="form-check-input" type="checkbox" ref="masters"
                                    defaultChecked={this.group != null && this.group.masters} />
                                <label class="form-check-label">Masters</label>
                            </div>
                            <div class="col">
                                <input class="form-check-input" type="checkbox" ref="warehouse"
                                    defaultChecked={this.group != null && this.group.warehouse} />
                                <label class="form-check-label">Warehouse</label>
                            </div>
                            <div class="col">
                                <input class="form-check-input" type="checkbox" ref="manufacturing"
                                    defaultChecked={this.group != null && this.group.manufacturing} />
                                <label class="form-check-label">Manufacturing</label>
                            </div>
                            <div class="col">
                                <input class="form-check-input" type="checkbox" ref="preparation"
                                    defaultChecked={this.group != null && this.group.preparation} />
                                <label class="form-check-label">Preparation</label>
                            </div>
                            <div class="col">
                                <input class="form-check-input" type="checkbox" ref="admin"
                                    defaultChecked={this.group != null && this.group.admin} />
                                <label class="form-check-label">Admin</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.group != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.group == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.group != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Groups;