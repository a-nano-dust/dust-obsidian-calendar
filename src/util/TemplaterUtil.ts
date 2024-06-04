import {TAbstractFile} from 'obsidian';
import TemplateUtil from "./TemplateUtil";
import DustCalendarPlugin from "../main";
import Path from "./Path";


export default class TemplaterUtil extends TemplateUtil {
    constructor(plugin: DustCalendarPlugin) {
        super(plugin);
    }

    public isEnable(): boolean {
        let pluginList = (this.plugin.app as any).plugins.plugins;
        return Object.keys(pluginList).includes("templater-obsidian");
    }

    public getTemplateFolder(): Path {
        return new Path((this.plugin.app as any).plugins.plugins["templater-obsidian"].settings.templates_folder);
    }

    public insertTemplateImpl(templateFile: TAbstractFile) {
        let templatesPlugin = (this.plugin.app as any).plugins.plugins["templater-obsidian"]
        templatesPlugin.templater.append_template_to_active_file(templateFile);
    }
}