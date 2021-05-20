import {App, Modal, DropdownComponent, TFile, ButtonComponent} from "obsidian"
import FrontMatterProperty from "src/FrontMatterProperty"
import linkContextMenu from "src/linkContextMenu/linkContextMenu"

export default class valueToggleModal extends Modal {
    app: App
    file: TFile
    name: string
    value: string
    settings: FrontMatterProperty
    newValue: string

    constructor(app: App, file: TFile, name: string, value: string, settings: FrontMatterProperty){
        super(app)
        this.app = app
        this.file = file
        this.name = name
        this.value = value
        this.settings = settings
        this.newValue = null
    }

    onOpen(){
        const inputDiv = this.contentEl.createDiv({
            cls: "frontmatter-modal-value"
        })
        this.buildInputEl(inputDiv)
    }

    buildInputEl(inputDiv: HTMLDivElement): void{
        const selectEl = new DropdownComponent(inputDiv)
        selectEl.selectEl.addClass("frontmatter-select")
        const values = this.settings.values
        selectEl.addOption("","--Empty--")
        Object.keys(values).forEach(key => {
            selectEl.addOption(values[key], values[key])
        });
        if(Object.values(values).includes(this.value)){
            selectEl.setValue(this.value)
        }
        selectEl.onChange(value => this.newValue = value != "--Empty--" ? value : "")
        const submitButton = new ButtonComponent(inputDiv)
        submitButton.setTooltip("Save")
            .setIcon("checkmark")
            .onClick(async () => {
                if(this.newValue || this.newValue == ""){
                    linkContextMenu.replaceFrontmatterAttribute(this.app, this.file, this.name, this.newValue)
                }
                this.close()
            })
    }
}