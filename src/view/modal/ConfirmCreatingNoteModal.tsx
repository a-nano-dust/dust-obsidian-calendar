import {MarkdownView, Modal, Notice, Setting} from "obsidian";
import Path from "../../util/Path";
import {text} from "stream/consumers";
import MainController from "../../core/MainController";

export default class ConfirmCreatingNoteModal extends Modal {

    private _filename: Path;       // 要创建的文件名，可以包含路径
    private _canCreateFile: boolean;
    // private _callback: (filename: Path) => void;
    private _dairyController: MainController;

    constructor(filename: Path, dairyController: MainController) {
        super(filename.app);
        this._filename = filename;
        this._canCreateFile = false;
        this._dairyController = dairyController;
    }

    onOpen(): void {
        this.titleEl.createEl("h1", {text: "创建新笔记"});
        this.contentEl.createEl("p", {text: "".concat("创建一个新笔记，名为", this._filename.string)})
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

    onClose(): void {
        if (this._canCreateFile) {
            // this._callback(this._filename);
            setTimeout(() => this._dairyController.createFile(this._filename), 100);
        }

        // new Promise<Path>(resolve => resolve(this._filename)).then((path) => this._callback(path));
    }



}