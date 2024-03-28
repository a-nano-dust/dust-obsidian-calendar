import {MarkdownView, Notice, TFile, WorkspaceLeaf} from "obsidian";
import {DateTime} from "luxon";
import SelectedItem from "../entity/SelectedItem";
import {NoteType, SelectedItemType} from "../base/enum";
import Path from "../util/Path";
import ConfirmCreatingNoteModal from "../view/modal/ConfirmCreatingNoteModal";
import DustDiaryPlugin from "../main";
import PluginSetting from "../entity/PluginSetting";
import PathUtil from "../util/PathUtil";
import {CalendarView, VIEW_TYPE_CALENDAR} from "../view/CalendarView";


export default class MainController {

    private readonly _plugin: DustDiaryPlugin;
    private _setting: PluginSetting;

    constructor(plugin: DustDiaryPlugin) {
        this._plugin = plugin;
        this._setting = new PluginSetting();
    }

    async loadSettings() {
        this._setting = Object.assign({}, this._setting, await this._plugin.loadData());
    }

    async saveSettings() {
        await this._plugin.saveData(this._setting);
    }

    public hasNote(date: DateTime, noteType: NoteType): boolean {
        return this.getNoteFilename(date, noteType) !== null;
    }

    public getNoteFilename(date: DateTime, noteType: NoteType): string | null {
        const notePattern: string | null = this.getNotePattern(noteType);
        if (notePattern === null) {
            return null;
        }

        const notePath = date.toFormat(notePattern).concat(".md");
        const abstractFile = this.plugin.app.vault.getAbstractFileByPath(notePath);
        if (!(abstractFile instanceof TFile)) {
            return null;
        }
        return abstractFile.path;
    }

    public getDailyNote(date: DateTime): TFile | null {
        const {dailyNotePattern} = this._setting;
        let dailyNotePath = date.toFormat(dailyNotePattern);
        let abstractFile = this.plugin.app.vault.getAbstractFileByPath(dailyNotePath);

        if (abstractFile instanceof TFile) {
            return abstractFile as TFile;
        }

        return null;
    }

    public openFileBySelectedItem(selectedItem: SelectedItem): void {
        if (selectedItem.type === SelectedItemType.DAY_ITEM) {
            this.openFileByNoteType(selectedItem.date, NoteType.DAILY);
        }
        else if (selectedItem.type === SelectedItemType.WEEK_INDEX_ITEM) {
            this.openFileByNoteType(selectedItem.date, NoteType.WEEKLY)
        }
        else if (selectedItem.type === SelectedItemType.MONTH_ITEM) {
            this.openFileByNoteType(selectedItem.date, NoteType.MONTHLY)
        }
        else if (selectedItem.type === SelectedItemType.QUARTER_ITEM) {
            this.openFileByNoteType(selectedItem.date, NoteType.QUARTERLY)
        }
        else if (selectedItem.type === SelectedItemType.YEAR_ITEM) {
            this.openFileByNoteType(selectedItem.date, NoteType.YEARLY)
        }
    }

    public openFileByNoteType(date: DateTime, noteType: NoteType): void {
        const notePattern: string | null = this.getNotePattern(noteType);
        if (notePattern === null) {
            return;
        }

        const notePath = date.toFormat(notePattern).concat(".md");
        this.openFile(new Path(notePath));
    }

    public openFile(filename: Path): void {

        if (PathUtil.exists(filename, this.plugin.app.vault)) {
            PathUtil.create(filename, this.plugin.app.vault).then(abstractFIle => {
                this.openFileTabView(<TFile>abstractFIle);
            });
        }

        const modal = new ConfirmCreatingNoteModal(filename, this);
        modal.open();
    }

    public createFile(filename: Path): void {
        PathUtil.create(filename, this.plugin.app.vault).then(abstractFile => {
            this.openFileTabView(<TFile>abstractFile);
            this.activeCalendarView();
        }, () => new Notice("".concat('创建"', filename.string, '"失败')));
    }

    public openFileTabView(tFile: TFile): void {

        const {app} = this._plugin;

        // 寻找已打开的标签页
        let targetView: MarkdownView | null = null;
        app.workspace.iterateRootLeaves(leaf => {
            if (leaf.getViewState().type === "markdown" && leaf.getDisplayText() === tFile.basename) {
                let view = leaf.view as MarkdownView;
                if (view.file !== null && view.file.path === tFile.path && targetView === null) {
                    targetView = view;
                }
            }
        });

        //
        if (targetView === null) {
            targetView = new MarkdownView(app.workspace.getLeaf("tab"));
            targetView.leaf.openFile(tFile).then(() => {
            })
        }
        app.workspace.revealLeaf(targetView.leaf);
    }

    public activeCalendarView(): void {
        const {workspace} = this.plugin.app;

        // 检查该类型的视图是否存在，如果不存在，则创建
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
        if (leaves.length > 0) {
            leaf = leaves[0];
            (leaf.view as CalendarView).flush();
        }
    }

    get plugin(): DustDiaryPlugin {
        return this._plugin;
    }

    get setting(): PluginSetting {
        return this._setting;
    }

    set setting(pluginSetting: PluginSetting) {
        this._setting = pluginSetting;
    }

    private getNotePattern(noteType: NoteType): string | null {

        let noteOption: boolean = false;
        let notePattern: string = "";

        if (noteType === NoteType.DAILY) {
            noteOption = this._setting.dailyNoteOption;
            notePattern = this._setting.dailyNotePattern;
        }
        else if (noteType === NoteType.WEEKLY) {
            noteOption = this._setting.weeklyNoteOption;
            notePattern = this._setting.weeklyNotePattern;
        }
        else if (noteType === NoteType.MONTHLY) {
            noteOption = this._setting.monthlyNoteOption;
            notePattern = this._setting.monthlyNotePattern;
        }
        else if (noteType === NoteType.QUARTERLY) {
            noteOption = this._setting.quarterlyNoteOption;
            notePattern = this._setting.quarterlyNotePattern;
        }
        else if (noteType === NoteType.YEARLY) {
            noteOption = this._setting.yearlyNoteOption;
            notePattern = this._setting.yearlyNotePattern;
        }

        if (!noteOption || notePattern.length === 0) {
            return null;
        }

        return notePattern;
    }

}