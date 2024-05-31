import {TAbstractFile} from 'obsidian';
import {NoteType, TemplatePlugin} from "../base/enum";
import MainController from "./MainController";
import Path from "../util/Path";
import PathUtil from "../util/PathUtil";


export default class TemplateController {

    private _mainController: MainController;
    private _templatePlugin: TemplatePlugin;
    private _noteType: NoteType;
    private _templateFolder: Path | null;
    private _templateFile: TAbstractFile | null;

    constructor(mainController: MainController) {
        this._mainController = mainController;
        this._templatePlugin = TemplatePlugin.NONE;
        this._noteType = NoteType.DAILY;
        this._templateFolder = null;
        this._templateFile = null;
    }

    public isTemplateFile(pureFilename: Path): boolean {
        return this.getTemplateFile(pureFilename) !== null;
    }

    public insertTemplate() {

        console.log(this._mainController.app)

        if (this._templateFile === null) {
            console.log("insertTemplate")
            return;
        }

        console.log("insertTemplate")
        if (this._templatePlugin === TemplatePlugin.OBSIDIAN && this.checkTemplatePluginObsidian()) {
            console.log("insertTemplate")
            this.notifyObsidian(this);
        }
        console.log("insertTemplate")
        if (this._templatePlugin === TemplatePlugin.TEMPLATER && this.checkTemplatePluginTemplater()) {
            console.log("insertTemplate")
            this.notifyTemplater(this);
        }
        console.log("insertTemplate")
    }

    public notifyObsidian(templateController: TemplateController) {
        if (templateController._mainController.app.workspace.activeEditor !== null) {
            templateController.insertTemplateByObsidian();
        }
        else {
            setTimeout(() => templateController.notifyObsidian(templateController), 100);
        }
    }

    private insertTemplateByObsidian() {
        let templatesPlugin = (this._mainController.app as any).internalPlugins.plugins.templates;
        templatesPlugin.instance.insertTemplate(this._templateFile);
    }

    public notifyTemplater(templateController: TemplateController) {

    }

    private insertTemplateByTemplater() {

    }

    private checkTemplatePlugin(): boolean {
        if (this._templatePlugin === TemplatePlugin.OBSIDIAN) {
            return this.checkTemplatePluginObsidian();
        }
        else if (this._templatePlugin === TemplatePlugin.TEMPLATER) {
            return this.checkTemplatePluginTemplater();
        }
        else {
            return false;
        }
    }

    private checkTemplatePluginObsidian(): boolean {
        let pluginList = (this._mainController.app as any).internalPlugins.plugins;
        return Object.keys(pluginList).includes("templates");
        // Object.keys(pluginList).find((e) => e == "template");
    }

    private checkTemplatePluginTemplater(): boolean {
        return false;
    }

    private getTemplateFile(pureFilename: Path): TAbstractFile | null {
        if (this._templateFolder === null) {
            return null;
        }

        // 补全文件后缀名
        let newPureFilenameStr = pureFilename.string;
        if (pureFilename.extension.string.length === 0) {
            newPureFilenameStr = newPureFilenameStr.concat(".md");
        }
        let newPureFilename = new Path(newPureFilenameStr);

        const fullPath = this._templateFolder.append(newPureFilename);
        return this._mainController.app.vault.getAbstractFileByPath(fullPath.string)
    }

    get templatePlugin(): TemplatePlugin {
        return this._templatePlugin;
    }

    // 更新插件类型时需要检查插件是否存在
    set templatePlugin(templatePlugin: TemplatePlugin) {
        if (templatePlugin === TemplatePlugin.OBSIDIAN && this.checkTemplatePluginObsidian()) {
            this._templatePlugin = TemplatePlugin.OBSIDIAN;
            this._templateFolder = new Path((this._mainController.app as any).internalPlugins.plugins.templates.instance.options.folder);
            console.log(this._templateFolder.string)
            if (this._templateFolder.string.length === 0 || !PathUtil.exists(this._templateFolder, this._mainController.app.vault)) {
                this._templateFolder = null;
            }
            return;
        }
        if (templatePlugin === TemplatePlugin.TEMPLATER && this.checkTemplatePluginTemplater()) {
            this._templatePlugin = TemplatePlugin.TEMPLATER;
            return;
        }

        this._templatePlugin = TemplatePlugin.NONE;
    }

    get noteType(): NoteType {
        return this._noteType;
    }

    // todo 更新笔记类型时需要同时更新模板文件
    set noteType(noteType: NoteType) {
        this._noteType = noteType;
        if (this._noteType === NoteType.DAILY) {

            const dailyNoteOption = this._mainController.setting.dailyNoteOption;
            const filename = this._mainController.setting.dailyTemplateFilename;
            if (!dailyNoteOption || filename.length === 0) {
                this._templateFile = null;
            }
            else {
                this._templateFile = this.getTemplateFile(new Path(filename));
            }
        }
        else {
            this._templateFile = null;
        }
    }

    get templateFolder(): Path | null {
        return this._templateFolder;
    }
}