import { Component } from "react";
import i18next from 'i18next';

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

    isValid(color) {
        this.refs.errorMessage.innerText = "";
        if (color.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (color.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (color.hexColor.length > 6) {
            this.refs.errorMessage.innerText = i18next.t('color-6');
            return false;
        }
        return true;
    }

    add() {
        const color = this.getColorFromForm();
        if (!this.isValid(color)) {
            return;
        }

        this.addColor(color).then((ok) => {
            if (ok) {
                window.$('#colorModal').modal('hide');
            }
        });
    }

    update() {
        const color = this.getColorFromForm();
        color.id = this.color.id;
        if (!this.isValid(color)) {
            return;
        }

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
                        <h5 class="modal-title" id="colorModalLabel">{i18next.t('color')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.color != null ? this.color.name : ''} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('hex-color')}</label>
                            <input type="text" class="form-control" ref="hexColor" defaultValue={this.color != null ? this.color.hexColor : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.color != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.color == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.color != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ColorsModal;
