import {App, TAbstractFile} from 'obsidian';
import {NoteType, TemplatePlugin} from "../base/enum";


export class TemplateController {

    private _app: App;
    private _templatePlugin: TemplatePlugin;
    private _noteType: NoteType;
    private _templateFile: TAbstractFile | null;

    constructor(app: App) {
        this._app = app;
        this._templatePlugin = TemplatePlugin.NONE;
        this._noteType = NoteType.DAILY;
        this._templateFile = null;
    }

    public insertTemplate() {
        if (this._templatePlugin === TemplatePlugin.OBSIDIAN && this.checkTemplatePluginObsidian()) {
            this.notifyObsidian(this);
        }
        if (this._templatePlugin === TemplatePlugin.TEMPLATER && this.checkTemplatePluginTemplater()) {
            this.notifyTemplater(this);
        }
    }

    public notifyObsidian(templateController: TemplateController) {
        if (templateController._app.workspace.activeEditor !== null) {
            templateController.insertTemplateByObsidian();
        }
        else {
            setTimeout(() => templateController.notifyObsidian(templateController), 100);
        }
    }

    private insertTemplateByObsidian() {
        let templatesPlugin = (this._app as any).internalPlugins.plugins.templates;
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
        let pluginList = (this._app as any).internalPlugins.plugins;
        return Object.keys(pluginList).includes("templates");
        // Object.keys(pluginList).find((e) => e == "template");
    }

    private checkTemplatePluginTemplater(): boolean {
        return false;
    }

    get templatePlugin(): TemplatePlugin {
        return this._templatePlugin;
    }

    // 更新插件类型时需要检查插件是否存在
    set templatePlugin(templatePlugin: TemplatePlugin) {
        if (templatePlugin === TemplatePlugin.OBSIDIAN && this.checkTemplatePluginObsidian()) {
            this._templatePlugin = TemplatePlugin.OBSIDIAN;
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
    }


}