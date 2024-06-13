import {Modal, Setting} from "obsidian";
import React, {ChangeEvent} from "react";
import {createRoot, Root} from "react-dom/client";
import Path from "../../util/Path";
import DustCalendarPlugin from "../../main";


function ControlElement({modal}: { modal: ConfirmCreatingNoteModal }) {

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        modal.plugin.noteController.setShouldConfirmBeforeCreatingNote(!e.target.checked);
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-description">
                <input type="checkbox" style={{verticalAlign: "text-bottom"}} onChange={onInputChange}/>
                下次不再提示
            </div>
        </div>
        <div className="setting-item-control">
            <button onClick={() => modal.close()}>取消</button>
            <button className="mod-cta" onClick={() => modal.closeAndCreate()}>确定</button>
        </div>
    </>
}

export default class ConfirmCreatingNoteModal extends Modal {

    public plugin: DustCalendarPlugin;
    private filename: Path;                     // 要创建的文件名，可以包含路径
    private shouldCreateNote: boolean;          // 弹窗关闭时，是否应该创建笔记

    private controlElementRoot: Root | null;

    constructor(filename: Path, plugin: DustCalendarPlugin) {
        super(plugin.app);
        this.plugin = plugin;
        this.filename = filename;
        this.shouldCreateNote = false;
        this.controlElementRoot = null;
    }

    onOpen(): void {
        this.titleEl.createEl("h1", {text: "创建新笔记"});
        this.contentEl.createEl("p", {text: "".concat("是否要创建一个路径为 ", this.filename.string, " 的笔记")})

        let element = new Setting(this.contentEl);
        this.controlElementRoot = createRoot(element.settingEl);
        this.controlElementRoot.render(
            <ControlElement modal={this}/>
        );
    }

    async onClose(): Promise<void> {
        if (this.shouldCreateNote) {
            await this.plugin.noteController.createNote(this.filename);
        }
    }

    public closeAndCreate(): void {
        this.shouldCreateNote = true;
        this.close()
    }
}