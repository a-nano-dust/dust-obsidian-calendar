import {Modal, Setting} from "obsidian";
import Path from "../../util/Path";
import DustCalendarPlugin from "../../main";

export default class ConfirmCreatingNoteModal extends Modal {

    private _filename: Path;       // 要创建的文件名，可以包含路径
    private _canCreateFile: boolean;
    private plugin: DustCalendarPlugin;

    constructor(filename: Path, plugin: DustCalendarPlugin) {
        super(plugin.app);
        this._filename = filename;
        this._canCreateFile = false;
        this.plugin = plugin;
    }

    onOpen(): void {
        this.titleEl.createEl("h1", {text: "创建新笔记"});
        this.contentEl.createEl("p", {text: "".concat("是否要创建一个路径为 ", this._filename.string, " 的笔记")})
        let setting = new Setting(this.contentEl);
        setting.addButton((btn) => {
            btn.setButtonText("取消");
            btn.onClick(() => this.close());
        });
        setting.addButton((btn) => {
            btn.setButtonText("确定");
            btn.setCta();
            btn.onClick(() => {
                this._canCreateFile = true;
                this.close()
            });
        });
    }

    async onClose(): Promise<void> {
        if (this._canCreateFile) {
            await this.plugin.noteController.createNote(this._filename);
        }
    }

}