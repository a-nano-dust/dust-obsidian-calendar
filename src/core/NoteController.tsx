import {MarkdownView, TAbstractFile, TFile, WorkspaceLeaf} from "obsidian";
import {DateTime} from "luxon";
import MainController from "./MainController";
import {NoteType, SelectedItemType} from "../base/enum";
import SelectedItem from "../entity/SelectedItem";
import Path from "../util/Path";
import PathUtil from "../util/PathUtil";
import ConfirmCreatingNoteModal from "../view/modal/ConfirmCreatingNoteModal";


export default class NoteController {

    private _mainController: MainController;

    constructor(mainController: MainController) {
        this._mainController = mainController;
    }

    public hasNote(date: DateTime, noteType: NoteType): boolean {
        return this.getNoteByFilename(date, noteType) !== null;
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
        const notePattern: string | null = this.getNotePattern(noteType);
        if (notePattern === null) {
            return;
        }

        const notePath = date.toFormat(notePattern).concat(".md");
        this.openNote(new Path(notePath));
    }

    public openNote(filename: Path): void {
        const vault = this._mainController.app.vault;
        const file = vault.getAbstractFileByPath(filename.string);
        if (file !== null) {
            this.openNoteTabView(file as TFile);
            return;
        }

        const modal = new ConfirmCreatingNoteModal(filename, this);
        modal.open();
    }

    public async createNote(filename: Path): Promise<void> {
        let abstractFile: TAbstractFile = await PathUtil.create(filename, this._mainController.app.vault);
        this.openNoteTabView(abstractFile as TFile);
        this._mainController.flushCalendarView();
    }

    private openNoteTabView(tFile: TFile): void {

        const app = this.mainController.app;

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
        console.log("app.workspace.activeEditor: ", app.workspace.activeEditor);
        app.workspace.revealLeaf(targetView.leaf);
        // 移动焦点到笔记编辑区域
        app.workspace.setActiveLeaf(targetView.leaf, {focus: true});

        console.log("app.workspace.activeEditor: ", app.workspace.activeEditor);

        // this.insertTemplateExecutor(this);
    }

    private getNoteByFilename(date: DateTime, noteType: NoteType): string | null {
        const notePattern: string | null = this.getNotePattern(noteType);
        if (notePattern === null) {
            return null;
        }

        const notePath = date.toFormat(notePattern).concat(".md");
        const abstractFile = this._mainController.app.vault.getAbstractFileByPath(notePath);
        if (!(abstractFile instanceof TFile)) {
            return null;
        }
        return abstractFile.path;
    }

    private getNotePattern(noteType: NoteType): string | null {

        let noteOption: boolean = false;
        let notePattern: string = "";

        if (noteType === NoteType.DAILY) {
            noteOption = this._mainController.setting.dailyNoteOption;
            notePattern = this._mainController.setting.dailyNotePattern;
        }
        else if (noteType === NoteType.WEEKLY) {
            noteOption = this._mainController.setting.weeklyNoteOption;
            notePattern = this._mainController.setting.weeklyNotePattern;
        }
        else if (noteType === NoteType.MONTHLY) {
            noteOption = this._mainController.setting.monthlyNoteOption;
            notePattern = this._mainController.setting.monthlyNotePattern;
        }
        else if (noteType === NoteType.QUARTERLY) {
            noteOption = this._mainController.setting.quarterlyNoteOption;
            notePattern = this._mainController.setting.quarterlyNotePattern;
        }
        else if (noteType === NoteType.YEARLY) {
            noteOption = this._mainController.setting.yearlyNoteOption;
            notePattern = this._mainController.setting.yearlyNotePattern;
        }

        if (!noteOption || notePattern.length === 0) {
            return null;
        }

        return notePattern;
    }

    get mainController(): MainController {
        return this._mainController;
    }
}

