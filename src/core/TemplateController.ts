import {TAbstractFile} from 'obsidian';
import {NoteType, TemplatePlugin} from "../base/enum";
import Path from "../util/Path";
import PathUtil from "../util/PathUtil";
import DustCalendarPlugin from "../main";
import TemplateUtil from "../util/TemplateUtil";
import ObsidianTemplateUtil from "../util/ObsidianTemplateUtil";
import TemplaterUtil from "../util/TemplaterUtil";


export default class TemplateController {

    public readonly plugin: DustCalendarPlugin;
    public templateUtil: TemplateUtil;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.templateUtil = new TemplateUtil(this.plugin);
    }

    public updateTemplatePlugin(templatePlugin: TemplatePlugin): void {
        this.plugin.database.setting.templatePlugin = templatePlugin;
        console.log(templatePlugin)
        if (templatePlugin === TemplatePlugin.OBSIDIAN) {
            this.templateUtil = new ObsidianTemplateUtil(this.plugin);
        }
        else if (templatePlugin === TemplatePlugin.TEMPLATER) {
            this.templateUtil = new TemplaterUtil(this.plugin);
        }
        else {
            this.templateUtil = new TemplateUtil(this.plugin);
        }
    }

    public hasTemplateFolder(): boolean {
        const folder = new Path((this.plugin.app as any).internalPlugins.plugins.templates.instance.options.folder);
        return folder.string.length !== 0 && PathUtil.exists(folder, this.plugin.app.vault);
    }

    public getTemplateFolder(): Path {
        return this.templateUtil.getTemplateFolder();
    }

    public hasTemplateFile(filename: string): boolean {
        return this.getTemplateFileByFilename(filename) !== null;
    }

    public insertTemplate(noteType: NoteType) {

        if (!this.templateUtil.isEnable()) {
            return;
        }

        const templateFile = this.getTemplateFileByNoteType(noteType);
        if (templateFile === null) {
            return;
        }

        this.notify(this, templateFile);
    }

    public notify(templateController: TemplateController, templateFile: TAbstractFile) {
        if (templateController.plugin.app.workspace.activeEditor !== null) {
            templateController.insertTemplateImpl(templateFile);
        }
        else {
            setTimeout(() => templateController.notify(templateController, templateFile), 100);
        }
    }

    public insertTemplateImpl(templateFile: TAbstractFile) {
        this.templateUtil.insertTemplateImpl(templateFile);
    }

    public getTemplateFileByFilename(filename: string): TAbstractFile | null {
        const folder = this.getTemplateFolder();
        if (folder.string.length === 0 || !PathUtil.exists(folder, this.plugin.app.vault)) {
            return null;
        }

        return this.getTemplateFileImpl(folder, new Path(filename));
    }

    private getTemplateFileByNoteType(noteType: NoteType): TAbstractFile | null {

        const folder = this.getTemplateFolder();
        if (folder.string.length === 0 || !PathUtil.exists(folder, this.plugin.app.vault)) {
            return null;
        }

        const {setting} = this.plugin.database;
        if (noteType === NoteType.DAILY) {
            return this.getTemplateFileImpl(folder, new Path(setting.dailyTemplateFilename));
        }
        else if (noteType === NoteType.WEEKLY) {
            return this.getTemplateFileImpl(folder, new Path(setting.weeklyTemplateFilename));
        }
        else if (noteType === NoteType.MONTHLY) {
            return this.getTemplateFileImpl(folder, new Path(setting.monthlyTemplateFilename));
        }
        else if (noteType === NoteType.QUARTERLY) {
            return this.getTemplateFileImpl(folder, new Path(setting.quarterlyTemplateFilename));
        }
        else if (noteType === NoteType.YEARLY) {
            return this.getTemplateFileImpl(folder, new Path(setting.yearlyTemplateFilename));
        }

        return null;
    }

    private getTemplateFileImpl(folder: Path, pureFilename: Path): TAbstractFile | null {
        // 补全文件后缀名
        let newFilenameStr = pureFilename.string;
        if (pureFilename.extension.string.length === 0) {
            newFilenameStr = newFilenameStr.concat(".md");
        }
        console.log(newFilenameStr)
        let newFilename = new Path(newFilenameStr);

        const fullPath = folder.append(newFilename);
        return this.plugin.app.vault.getAbstractFileByPath(fullPath.string)
    }
}
