import { Component } from "react";


class AutocompleteField extends Component {

    constructor({ findByName, defaultValueId, defaultValueName, valueChanged, disabled }) {
        super();

        this.findByName = findByName;
        this.valueChanged = valueChanged;
        this.disabled = disabled;

        this.currentSelectedId = defaultValueId != null ? defaultValueId : "";
        this.defaultValueName = defaultValueName != null ? defaultValueName : "";

        this.autocomplete = this.autocomplete.bind(this);
    }

    componentDidMount() {
        this.autocomplete(this.refs.field);
    }

    autocomplete(inp) {
        const findByName = this.findByName;
        var that = this;
        var currentFocus;
        inp.addEventListener("input", async function (e) {
            that.currentSelectedId = "";
            that.valueChanged(that.currentSelectedId);
            var a, b, i, val = this.value;
            if (val == "") {
                var arr = [];
            } else {
                arr = await findByName(val.toUpperCase());
            }
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].name.substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i].name + "' rowId='" + arr[i].id + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    that.currentSelectedId = this.getElementsByTagName("input")[0].attributes["rowId"].value;
                    that.valueChanged(that.currentSelectedId);
                    closeAllLists();
                });
                a.appendChild(b);
            }
        });

        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    render() {
        return <form autocomplete="off">
            <div class="">
                <input type="text" class="form-control" ref="field" defaultValue={this.defaultValueName} readOnly={this.disabled} />
            </div>
        </form>
    }
}


export default AutocompleteField;
