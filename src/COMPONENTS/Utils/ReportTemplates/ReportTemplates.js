import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class ReportTemplates extends Component {
    constructor({ getReportTemplates, updateReportTemplate }) {
        super();

        this.getReportTemplates = getReportTemplates;
        this.updateReportTemplate = updateReportTemplate;

        this.list = [];

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getReportTemplates().then((templates) => {
            this.list = templates;
            for (let i = 0; i < this.list.length; i++) {
                this.list[i].id = this.list[i].key;
            }
            this.forceUpdate();
        });
    }

    edit(template) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderModal'));
        ReactDOM.render(
            <ReportTemplate
                template={template}
                updateReportTemplate={this.updateReportTemplate}
            />,
            document.getElementById('renderModal'));
    }

    render() {
        return <div id="tabReportTemplate" className="formRowRoot">
            <div id="renderModal"></div>
            <h4 className="ml-2 mb-2">{i18next.t('report-templates')}</h4>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'key', headerName: i18next.t('key'), flex: 1 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ReportTemplate extends Component {
    constructor({ template, updateReportTemplate }) {
        super();

        this.template = template;
        this.updateReportTemplate = updateReportTemplate;

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        window.$('#templateModal').modal({ show: true });
    }

    update() {
        this.updateReportTemplate({ key: this.template.key, html: this.refs.html.value });
        window.$('#templateModal').modal('hide');
    }

    render() {
        return <div class="modal fade" id="templateModal" tabindex="-1" role="dialog" aria-labelledby="templateModallLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="countryModalLabel">{i18next.t('report-template')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>HTML</label>
                        <textarea class="form-control" rows="10" defaultValue={this.template.html} ref="html"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ReportTemplates;
