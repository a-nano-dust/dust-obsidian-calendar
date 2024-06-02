import {MarkdownView, TAbstractFile, TFile, WorkspaceLeaf} from "obsidian";
import {DateTime} from "luxon";
import {NoteType, SelectedItemType} from "../base/enum";
import SelectedItem from "../entity/SelectedItem";
import Path from "../util/Path";
import PathUtil from "../util/PathUtil";
import ConfirmCreatingNoteModal from "../view/modal/ConfirmCreatingNoteModal";
import DustCalendarPlugin from "../main";


export default class NoteController {

    public readonly plugin: DustCalendarPlugin;
    private noteType: NoteType;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.noteType = NoteType.DAILY;
    }

    public hasNote(date: DateTime, noteType: NoteType): boolean {
        const noteFilename = this.getNoteFilename(date, noteType);
        if (noteFilename === null) {
            return false;
        }
        const abstractFile = this.plugin.app.vault.getAbstractFileByPath(noteFilename);
        return abstractFile instanceof TFile;
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

        console.log(this.plugin.app)

        let abstractFile: TAbstractFile = await PathUtil.create(filename, this.plugin.app.vault);
        this.openNoteTabView(abstractFile as TFile);
        this.plugin.flushCalendarView();
        this.plugin.templateController.insertTemplate(this.noteType);
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

    private getNoteFilename(date: DateTime, noteType: NoteType): string | null {
        const notePattern: string | null = this.getNotePattern(noteType);
        if (notePattern === null) {
            return null;
        }

        return date.toFormat(notePattern).concat(".md");
    }

    private getNotePattern(noteType: NoteType): string | null {

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
            return null;
        }

        return notePattern;
    }
}

