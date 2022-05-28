import { Component } from "react";
import i18next from 'i18next';
import { TextField } from "@material-ui/core";



class PurchaseOrderDescription extends Component {
    constructor({ notes, description, setNotes, setDescription }) {
        super();

        this.notes = notes;
        this.description = description;
        this.setNotes = setNotes;
        this.setDescription = setDescription;
    }

    render() {
        return <div>
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
}

export default PurchaseOrderDescription;
