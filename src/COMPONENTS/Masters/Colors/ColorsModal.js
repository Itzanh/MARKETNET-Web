import { Component } from "react";

class ColorsModal extends Component {
    constructor({ color, addColor, updateColor, deleteColor }) {
        super();

        this.color = color;

        this.addColor = addColor;
        this.updateColor = updateColor;
        this.deleteColor = deleteColor;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#colorModal').modal({ show: true });
    }

    getColorFromForm() {
        const color = {}
        color.name = this.refs.name.value;
        color.hexColor = this.refs.hexColor.value;
        return color;
    }

    add() {
        const color = this.getColorFromForm();

        this.addColor(color).then((ok) => {
            if (ok) {
                window.$('#colorModal').modal('hide');
            }
        });
    }

    update() {
        const color = this.getColorFromForm();
        color.id = this.color.id;

        this.updateColor(color).then((ok) => {
            if (ok) {
                window.$('#colorModal').modal('hide');
            }
        });
    }

    delete() {
        const colorId = this.color.id;
        this.deleteColor(colorId).then((ok) => {
            if (ok) {
                window.$('#colorModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="colorModal" tabindex="-1" role="dialog" aria-labelledby="colorModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="colorModalLabel">Color</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.color != null ? this.color.name : ''} />
                        </div>
                        <div class="form-group">
                            <label>Hex Color</label>
                            <input type="text" class="form-control" ref="hexColor" defaultValue={this.color != null ? this.color.hexColor : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.color != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.color == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.color != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ColorsModal;
