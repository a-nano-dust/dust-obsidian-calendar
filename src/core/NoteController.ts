import {MarkdownView, TAbstractFile, TFile, WorkspaceLeaf} from "obsidian";
import {DateTime} from "luxon";
import {NoteType, SelectedItemType} from "../base/enum";
import SelectedItem from "../entity/SelectedItem";
import {countWords} from "../util/util"
import Path from "../util/Path";
import PathUtil from "../util/PathUtil";
import ConfirmCreatingNoteModal from "../view/modal/ConfirmCreatingNoteModal";
import DustCalendarPlugin from "../main";


/**
 * 封装笔记操作
 */
export default class NoteController {

    public readonly plugin: DustCalendarPlugin;
    private noteType: NoteType;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.noteType = NoteType.DAILY;
    }

    public getNoteOption(noteType: NoteType): boolean {

        if (noteType === NoteType.DAILY) {
            return this.plugin.database.setting.dailyNoteOption;
        }
        else if (noteType === NoteType.WEEKLY) {
            return this.plugin.database.setting.weeklyNoteOption;
        }
        else if (noteType === NoteType.MONTHLY) {
            return this.plugin.database.setting.monthlyNoteOption;
        }
        else if (noteType === NoteType.QUARTERLY) {
            return this.plugin.database.setting.quarterlyNoteOption;
        }
        else if (noteType === NoteType.YEARLY) {
            return this.plugin.database.setting.yearlyNoteOption;
        }

        return false;
    }

    public setNoteOption(noteType: NoteType, noteOption: boolean): void {
        if (noteType === NoteType.DAILY) {
            this.plugin.database.setting.dailyNoteOption = noteOption;
        }
        else if (noteType === NoteType.WEEKLY) {
            this.plugin.database.setting.weeklyNoteOption = noteOption;
        }
        else if (noteType === NoteType.MONTHLY) {
            this.plugin.database.setting.monthlyNoteOption = noteOption;
        }
        else if (noteType === NoteType.QUARTERLY) {
            this.plugin.database.setting.quarterlyNoteOption = noteOption;
        }
        else if (noteType === NoteType.YEARLY) {
            this.plugin.database.setting.yearlyNoteOption = noteOption;
        }
    }

    public getNotePattern(noteType: NoteType): string {

        let noteOption: boolean = false;
        let notePattern: string = "";
        const {setting} = this.plugin.database;

        if (noteType === NoteType.DAILY) {
            noteOption = setting.dailyNoteOption;
            notePattern = setting.dailyNotePattern;
        }
        else if (noteType === NoteType.WEEKLY) {
            noteOption = setting.weeklyNoteOption;
            notePattern = setting.weeklyNotePattern;
        }
        else if (noteType === NoteType.MONTHLY) {
            noteOption = setting.monthlyNoteOption;
            notePattern = setting.monthlyNotePattern;
        }
        else if (noteType === NoteType.QUARTERLY) {
            noteOption = setting.quarterlyNoteOption;
            notePattern = setting.quarterlyNotePattern;
        }
        else if (noteType === NoteType.YEARLY) {
            noteOption = setting.yearlyNoteOption;
            notePattern = setting.yearlyNotePattern;
        }

        if (!noteOption || notePattern.length === 0) {
            return "";
        }

        return notePattern;
    }

    public setNotePattern(noteType: NoteType, notePattern: string): void {
        if (noteType === NoteType.DAILY) {
            this.plugin.database.setting.dailyNotePattern = notePattern;
        }
        else if (noteType === NoteType.WEEKLY) {
            this.plugin.database.setting.weeklyNotePattern = notePattern;
        }
        else if (noteType === NoteType.MONTHLY) {
            this.plugin.database.setting.monthlyNotePattern = notePattern;
        }
        else if (noteType === NoteType.QUARTERLY) {
            this.plugin.database.setting.quarterlyNotePattern = notePattern;
        }
        else if (noteType === NoteType.YEARLY) {
            this.plugin.database.setting.yearlyNotePattern = notePattern;
        }
    }

    public getNotePatternPlaceHolder(noteType: NoteType): string {

        if (noteType === NoteType.DAILY) {
            return "日记/yyyy-MM-dd";
        }
        else if (noteType === NoteType.WEEKLY) {
            return "周记/yyyy-WW";
        }
        else if (noteType === NoteType.MONTHLY) {
            return "月度总结/yyyy-MM";
        }
        else if (noteType === NoteType.QUARTERLY) {
            return "季度总结/yyyy-qq";
        }
        else if (noteType === NoteType.YEARLY) {
            return "年度总结/yyyy";
        }

        return "";
    }

    public hasNote(date: DateTime, noteType: NoteType): boolean {
        const noteFilename = this.getNoteFilename(date, noteType);
        if (noteFilename === null) {
            return false;
        }
        const abstractFile = this.plugin.app.vault.getAbstractFileByPath(noteFilename);
        return abstractFile instanceof TFile;
    }

    public getNoteFilename(date: DateTime, noteType: NoteType): string | null {
        const notePattern: string | null = this.getNotePattern(noteType);
        if (notePattern.length === 0) {
            return null;
        }
        return date.toFormat(notePattern).concat(".md");
    }

    public async countNoteWords(date: DateTime, noteType: NoteType): Promise<number | null> {
        const filename = this.getNoteFilename(date, noteType);
        if (filename === null) {
            return null;
        }

        const {vault} = this.plugin.app;
        const file = vault.getAbstractFileByPath(filename);
        if (file === null) {
            return null;
        }

        const content = await vault.cachedRead(file as TFile);
        return countWords(content);
    }

    public async countNoteDots(date: DateTime, noteType: NoteType): Promise<number | null> {
        const totalWords = await this.countNoteWords(date, noteType);
        if (totalWords === null) {
            return null;
        }
        return Math.ceil(totalWords / 200);
    }

    public openNoteBySelectedItem(selectedItem: SelectedItem): void {
        if (selectedItem.type === SelectedItemType.DAY_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.DAILY);
        }
        else if (selectedItem.type === SelectedItemType.WEEK_INDEX_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.WEEKLY)
        }
        else if (selectedItem.type === SelectedItemType.MONTH_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.MONTHLY)
        }
        else if (selectedItem.type === SelectedItemType.QUARTER_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.QUARTERLY)
        }
        else if (selectedItem.type === SelectedItemType.YEAR_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.YEARLY)
        }
    }

    public openNoteByNoteType(date: DateTime, noteType: NoteType): void {
        const noteFilename = this.getNoteFilename(date, noteType);
        if (noteFilename === null) {
            return;
        }
        this.noteType = noteType;
        this.openNoteByFilename(new Path(noteFilename));
    }

    public openNoteByFilename(filename: Path): void {
        const vault = this.plugin.app.vault;
        const file = vault.getAbstractFileByPath(filename.string);
        if (file !== null) {
            this.openNoteTabView(file as TFile);
            return;
        }

        const modal = new ConfirmCreatingNoteModal(filename, this.plugin);
        modal.open();
    }

    public async createNote(filename: Path): Promise<void> {
        const abstractFile: TAbstractFile = await PathUtil.create(filename, this.plugin.app.vault);
        this.openNoteTabView(abstractFile as TFile);
        this.plugin.templateController.insertTemplate(this.noteType);
        // 新建文件之后，需要更新统计信息
        this.plugin.noteStatisticController.addTaskByFile(abstractFile);
    }

    private openNoteTabView(tFile: TFile): void {
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

        if (targetView === null) {
            targetView = new MarkdownView(app.workspace.getLeaf("tab"));
            const targetLeaf: WorkspaceLeaf = targetView.leaf;
            targetLeaf.openFile(tFile).then(() => {
            });
        }
        app.workspace.revealLeaf(targetView.leaf);
        // 移动焦点到笔记编辑区域
        app.workspace.setActiveLeaf(targetView.leaf, {focus: true});
    }

}

