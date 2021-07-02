import { Component } from "react";

class SalesOrderDescription extends Component {
    constructor({ notes, description, setNotes, setDescription }) {
        super();

        this.notes = notes;
        this.description = description;
        this.setNotes = setNotes;
        this.setDescription = setDescription;
    }

    render() {
        return <div style={{ width: "100%" }}>
            <label className="mb-1 ml-1">Notes</label>
            <input type="text" class="form-control" ref="notes" defaultValue={this.notes} onChange={() => {
                this.setNotes(this.refs.notes.value);
            }} />
            <label className="mb-1 ml-1">Description</label>
            <textarea class="form-control" rows="10" ref="description" defaultValue={this.description} onChange={() => {
                this.setDescription(this.refs.description.value);
            }}></textarea>
        </div>
    }
}

export default SalesOrderDescription;
