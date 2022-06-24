/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import i18next from 'i18next';
import { TextField } from "@material-ui/core";



class SalesOrderDescription extends Component {
    constructor({ notes, description, setNotes, setDescription }) {
        super();

        this.notes = notes;
        this.description = description;
        this.setNotes = setNotes;
        this.setDescription = setDescription;
    }

    render() {
        return <div className="ml-2 mr-2 pt-3">
            <TextField label={i18next.t('notes')} variant="outlined" fullWidth size="small" defaultValue={this.notes} onChange={(e) => {
                this.setNotes(e.target.value);
            }} inputProps={{ maxLength: 250 }} />
            <br />
            <br />
            <TextField label={i18next.t('description')} variant="outlined" fullWidth size="small" defaultValue={this.description}
                multiline maxRows={10} minRows={5} onChange={(e) => {
                    this.setDescription(e.target.value);
                }} inputProps={{ maxLength: 3000 }} />
        </div>
    }
};



export default SalesOrderDescription;
