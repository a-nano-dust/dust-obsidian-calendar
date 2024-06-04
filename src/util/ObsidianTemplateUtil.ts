import {TAbstractFile} from 'obsidian';
import DustCalendarPlugin from "../main";
import Path from "./Path";
import TemplateUtil from "./TemplateUtil";


export default class ObsidianTemplateUtil extends TemplateUtil {

    constructor(plugin: DustCalendarPlugin) {
        super(plugin);
    }

    public isEnable(): boolean {
        let pluginList = (this.plugin.app as any).internalPlugins.plugins;
        return Object.keys(pluginList).includes("templates");
    }

    public getTemplateFolder(): Path {
        return new Path((this.plugin.app as any).internalPlugins.plugins.templates.instance.options.folder);
    }

    public insertTemplateImpl(templateFile: TAbstractFile) {
        let templatesPlugin = (this.plugin.app as any).internalPlugins.plugins.templates;
        templatesPlugin.instance.insertTemplate(templateFile);
    }


}