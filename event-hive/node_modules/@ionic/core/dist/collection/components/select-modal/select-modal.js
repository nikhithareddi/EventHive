/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { getIonMode } from "../../global/ionic-global";
import { Host, forceUpdate, h } from "@stencil/core";
import { safeCall } from "../../utils/overlays";
import { getClassMap } from "../../utils/theme";
export class SelectModal {
    constructor() {
        this.header = undefined;
        this.multiple = undefined;
        this.options = [];
    }
    closeModal() {
        const modal = this.el.closest('ion-modal');
        if (modal) {
            modal.dismiss();
        }
    }
    findOptionFromEvent(ev) {
        const { options } = this;
        return options.find((o) => o.value === ev.target.value);
    }
    getValues(ev) {
        const { multiple, options } = this;
        if (multiple) {
            // this is a modal with checkboxes (multiple value select)
            // return an array of all the checked values
            return options.filter((o) => o.checked).map((o) => o.value);
        }
        // this is a modal with radio buttons (single value select)
        // return the value that was clicked, otherwise undefined
        const option = ev ? this.findOptionFromEvent(ev) : null;
        return option ? option.value : undefined;
    }
    callOptionHandler(ev) {
        const option = this.findOptionFromEvent(ev);
        const values = this.getValues(ev);
        if (option === null || option === void 0 ? void 0 : option.handler) {
            safeCall(option.handler, values);
        }
    }
    setChecked(ev) {
        const { multiple } = this;
        const option = this.findOptionFromEvent(ev);
        // this is a modal with checkboxes (multiple value select)
        // we need to set the checked value for this option
        if (multiple && option) {
            option.checked = ev.detail.checked;
        }
    }
    renderRadioOptions() {
        const checked = this.options.filter((o) => o.checked).map((o) => o.value)[0];
        return (h("ion-radio-group", { value: checked, onIonChange: (ev) => this.callOptionHandler(ev) }, this.options.map((option) => (h("ion-item", { lines: "none", class: Object.assign({
                // TODO FW-4784
                'item-radio-checked': option.value === checked
            }, getClassMap(option.cssClass)) }, h("ion-radio", { value: option.value, disabled: option.disabled, justify: "start", labelPlacement: "end", onClick: () => this.closeModal(), onKeyUp: (ev) => {
                if (ev.key === ' ') {
                    /**
                     * Selecting a radio option with keyboard navigation,
                     * either through the Enter or Space keys, should
                     * dismiss the modal.
                     */
                    this.closeModal();
                }
            } }, option.text))))));
    }
    renderCheckboxOptions() {
        return this.options.map((option) => (h("ion-item", { class: Object.assign({
                // TODO FW-4784
                'item-checkbox-checked': option.checked
            }, getClassMap(option.cssClass)) }, h("ion-checkbox", { value: option.value, disabled: option.disabled, checked: option.checked, justify: "start", labelPlacement: "end", onIonChange: (ev) => {
                this.setChecked(ev);
                this.callOptionHandler(ev);
                // TODO FW-4784
                forceUpdate(this);
            } }, option.text))));
    }
    render() {
        return (h(Host, { key: '4df42c447b4026d09d9231f09dc4bdae9a8cfe4a', class: getIonMode(this) }, h("ion-header", { key: '211c4e869b858867f3d60637e570aeb01de41de7' }, h("ion-toolbar", { key: 'dc4b151331aecbaaaafb460802ee9b689493601d' }, this.header !== undefined && h("ion-title", { key: 'ba1347a59ae0a5c6770c239b5ec02a536a445bd1' }, this.header), h("ion-buttons", { key: '43c98fd25d7e7f54b94b24e53535c6d5ba599892', slot: "end" }, h("ion-button", { key: '51b2b3f3eed42637b2cfc213c95d0bcf10e4b89d', onClick: () => this.closeModal() }, "Close")))), h("ion-content", { key: 'fe721b09f80555856211f7e40dbfc31a533acae1' }, h("ion-list", { key: 'd0b932d137136958d896408fb2fa571023775b92' }, this.multiple === true ? this.renderCheckboxOptions() : this.renderRadioOptions()))));
    }
    static get is() { return "ion-select-modal"; }
    static get encapsulation() { return "scoped"; }
    static get originalStyleUrls() {
        return {
            "ios": ["select-modal.ios.scss"],
            "md": ["select-modal.md.scss"],
            "ionic": ["select-modal.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["select-modal.ios.css"],
            "md": ["select-modal.md.css"],
            "ionic": ["select-modal.md.css"]
        };
    }
    static get properties() {
        return {
            "header": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "header",
                "reflect": false
            },
            "multiple": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "attribute": "multiple",
                "reflect": false
            },
            "options": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "SelectModalOption[]",
                    "resolved": "SelectModalOption[]",
                    "references": {
                        "SelectModalOption": {
                            "location": "import",
                            "path": "./select-modal-interface",
                            "id": "src/components/select-modal/select-modal-interface.ts::SelectModalOption"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "defaultValue": "[]"
            }
        };
    }
    static get elementRef() { return "el"; }
}
