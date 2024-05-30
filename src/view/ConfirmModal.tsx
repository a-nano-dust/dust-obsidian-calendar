import { Modal, Setting } from "obsidian";
import Controller from "../base/Controller";

export default class ConfirmCreatingNoteModal extends Modal {
  private _path: string; // 要创建的文件名，可以包含路径
  private _folder: string; // 要创建的文件名，可以包含路径
  private _controller: Controller;

  constructor(path: string, folder: string, controller: Controller) {
    super(controller.plugin.app);
    this._path = path;
    this._folder = folder;
    this._controller = controller;
  }

  onOpen(): void {
    this.contentEl.createEl("h3", { text: "创建新笔记" });
    this.contentEl.createEl("p", {
      text: "".concat("是否要创建一个路径为 ", this._path, " 的笔记"),
    });
    let setting = new Setting(this.contentEl);
    setting.addButton((btn) => {
      btn.setButtonText("取消");
      btn.onClick(() => this.close());
    });
    setting.addButton((btn) => {
      btn.setButtonText("确定");
      btn.setCta();
      btn.onClick(() => {
        this._controller.createFile(this._path, this._folder);
        this.close();
      });
    });
  }

  onClose(): void {}
}
