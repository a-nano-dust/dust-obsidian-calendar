import {MarkdownView, Notice, TFile} from "obsidian";
import SelectedItem from "../entity/SelectedItem";
import {SelectedItemType} from "../base/enum";
import Path from "../util/Path";
import ConfirmCreatingNoteModal from "../view/modal/ConfirmCreatingNoteModal";
import {DateTime} from "luxon";
import DustDiaryPlugin from "../main";
import PluginSetting from "../entity/PluginSetting";


export default class MainController {

    private readonly _plugin : DustDiaryPlugin;
    private _setting: PluginSetting;

    constructor(plugin : DustDiaryPlugin) {
        this._plugin = plugin;
        this._setting = new PluginSetting();
    }

    async loadSettings() {
        this._setting = Object.assign({}, this._setting, await this._plugin.loadData());
    }

    async saveSettings() {
        await this._plugin.saveData(this._setting);
    }

    hasDailyNote(dateTime : DateTime) : boolean {
        const {dailyNotePattern} = this._setting;
        let dailyNotePath = dateTime.toFormat(dailyNotePattern).concat(".md");
        return this.plugin.app.vault.getAbstractFileByPath(dailyNotePath) instanceof TFile;
    }

    getDailyNote(dateTime : DateTime) : TFile | null {
        const {dailyNotePattern} = this._setting;
        let dailyNotePath = dateTime.toFormat(dailyNotePattern);
        let abstractFile = this.plugin.app.vault.getAbstractFileByPath(dailyNotePath);

        if (abstractFile instanceof TFile) {
            return abstractFile as TFile;
        }

        return null;
    }

    public openFileBySelectedItem(selectedItem: SelectedItem): void {

        const {app} = this._plugin;
        const {dailyNotePattern} = this._setting;

        if (selectedItem.type === SelectedItemType.DAY_ITEM) {
            let path = selectedItem.date.toFormat(dailyNotePattern).concat(".md");
            // let filename: string = "".concat(selectedItem.date.year.toString(), "-", selectedItem.date.month.toString(), "-", selectedItem.date.dayInMonth.toString(), ".md");
            this.openFile(new Path(app, path));
        }
    }

    public openFile(filename: Path): void {

        if (filename.exists()) {
            filename.createIfNotExist().then(tAbstractFile => {
                this.openFileTabView(<TFile>tAbstractFile);
            });
        } else {
            let modal = new ConfirmCreatingNoteModal(filename, this);
            modal.open();
        }
    }

    public createFile(filename: Path): void {

        filename.createIfNotExist()
            .then(tAbstractFile => {
                    this.openFileTabView(<TFile>tAbstractFile);
                },
                () => new Notice("".concat('创建"', filename.string, '"失败')));
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
            targetView.leaf.openFile(tFile).then(() => {})
        }
        app.workspace.revealLeaf(targetView.leaf);
    }

    get plugin() : DustDiaryPlugin {
        return this._plugin;
    }

    get setting(): PluginSetting {
        return this._setting;
    }

}