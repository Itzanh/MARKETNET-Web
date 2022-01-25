import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from "i18next";
import { DataGrid } from '@material-ui/data-grid';
import LocateProductFamily from "../../Masters/ProductFamilies/LocateProductFamily";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';



class InventoyValuation extends Component {
    constructor({ getInventoyValuation, locateProductFamilies }) {
        super();

        this.getInventoyValuation = getInventoyValuation;
        this.locateProductFamilies = locateProductFamilies;

        this.list = [];
        this.familyId = null;

        this.renderInventoyValuation = this.renderInventoyValuation.bind(this);
        this.locateFamily = this.locateFamily.bind(this);
    }

    renderInventoyValuation() {
        this.getInventoyValuation({
            date: new Date(this.refs.date.value),
            productFamily: this.familyId
        }).then((list) => {
            for (let i = 0; i < list.length; i++) {
                list[i].id = i;
            }
            this.list = list;
            this.forceUpdate();
        });
    }

    locateFamily() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<LocateProductFamily
            locateProductFamilies={this.locateProductFamilies}
            onSelect={(family) => {
                this.familyId = family.id;
                this.refs.familyName.value = family.name;
            }}
        />, this.refs.render);
    }

    render() {
        return <div id="tabInventoyValuation" className="formRowRoot">
            <div ref="render"></div>
            <h4 className="ml-2">{i18next.t('inventory-valuation')}</h4>
            <div class="form-row">
                <div class="col">
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('product-family')}</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <button class="btn btn-outline-secondary" type="button" onClick={this.locateFamily}><HighlightIcon /></button>
                                </div>
                                <input type="text" class="form-control" ref="familyName" readOnly={true} />
                            </div>
                        </div>
                        <div class="col" style={{ 'max-width': '25%' }}>
                            <label>{i18next.t('date')}</label>
                            <input type="date" class="form-control" ref="date" />
                        </div>
                        <div class="col" style={{ 'max-width': '10%' }}>
                            <button type="button" class="btn btn-primary" onClick={this.renderInventoyValuation}>{i18next.t('search')}</button>
                        </div>
                    </div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'productName', headerName: i18next.t('name'), flex: 1 },
                    { field: 'quantity', headerName: i18next.t('quantity'), width: 250 },
                    { field: 'costPrice', headerName: i18next.t('cost-price'), width: 250 },
                    { field: 'value', headerName: i18next.t('value'), width: 250 },
                ]}
            />
        </div>
    }
}



export default InventoyValuation;
