import {App, WorkspaceLeaf} from "obsidian";
import DustCalendarPlugin from "../main";
import PluginSetting from "../entity/PluginSetting";
import {CalendarView, VIEW_TYPE_CALENDAR} from "../view/CalendarView";
import {QuarterNameMode} from "../base/enum";
import NoteController from "./NoteController";


export default class MainController {

    private _app: App;
    private readonly _plugin: DustCalendarPlugin;
    private _setting: PluginSetting;
    private _noteController: NoteController;
    private _quarterNameMap: Map<number, string> | null;

    constructor(plugin: DustCalendarPlugin) {
        this._plugin = plugin;
        this._app = plugin.app;
        this._setting = new PluginSetting();
        this._noteController = new NoteController(this);
        this._quarterNameMap = null;
    }

    async loadSettings() {
        this._setting = Object.assign({}, this._setting, await this._plugin.loadData());
        this.updateQuarterNameMap();
    }

    async saveSettings() {
        await this._plugin.saveData(this._setting);
        this.updateQuarterNameMap();
    }

    // 强制刷新日历页面
    public flushCalendarView(): void {
        const {workspace} = this.plugin.app;

        // 检查该类型的视图是否存在，如果不存在，则创建
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
        if (leaves.length > 0) {
            leaf = leaves[0];
            (leaf.view as CalendarView).flush();
        }
    }

    get app(): App {
        return this._app;
    }

    get plugin(): DustCalendarPlugin {
        return this._plugin;
    }

    get setting(): PluginSetting {
        return this._setting;
    }

    set setting(pluginSetting: PluginSetting) {
        this._setting = pluginSetting;
    }

    get noteController(): NoteController {
        return this._noteController;
    }

    private updateQuarterNameMap() {
        let newQuarterNameMap = new Map();
        if (this.setting.quarterNameMode === QuarterNameMode.NUMBER) {
            newQuarterNameMap.set(1, "1季度");
            newQuarterNameMap.set(2, "2季度");
            newQuarterNameMap.set(3, "3季度");
            newQuarterNameMap.set(4, "4季度");
        }
        else {
            newQuarterNameMap.set(1, "春");
            newQuarterNameMap.set(2, "夏");
            newQuarterNameMap.set(3, "秋");
            newQuarterNameMap.set(4, "冬");
        }
        this._quarterNameMap = newQuarterNameMap;
    }

    public getQuarterName(quarterIndex: number): string {
        return this._quarterNameMap?.get(quarterIndex)!;
    }
}