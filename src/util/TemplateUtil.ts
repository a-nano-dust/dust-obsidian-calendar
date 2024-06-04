import {TAbstractFile} from 'obsidian';
import DustCalendarPlugin from "../main";
import Path from "./Path";


export default class TemplateUtil {

    public readonly plugin: DustCalendarPlugin;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
    }

    public isEnable(): boolean {
        return false;
    }

    public getTemplateFolder(): Path {
        return new Path("");
    }

    public insertTemplateImpl(templateFile: TAbstractFile) {

    }

}