import {App, Plugin, PluginManifest, WorkspaceLeaf} from 'obsidian';
import {CalendarView, VIEW_TYPE_CALENDAR} from './view/CalendarView';
import Database from "./core/Database";
import NoteController from "./core/NoteController";
import TemplateController from "./core/TemplateController";
import MainSettingTab from "./setting/MainSettingTab";


// 插件对象
export default class DustCalendarPlugin extends Plugin {

    public readonly database: Database;
    public readonly noteController: NoteController;
    public readonly templateController: TemplateController;
    public readonly mainSettingTab: MainSettingTab;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        // this.mainController = new MainController(this);
        this.database = new Database(this);
        this.noteController = new NoteController(this);
        this.templateController = new TemplateController(this);
        this.mainSettingTab = new MainSettingTab(this);
    }

    // 插件开启时执行初始化操作
    async onload() {
        // 加载插件设置
        await this.database.loadSetting();

        // 注册日历视图
        this.registerView(VIEW_TYPE_CALENDAR, (leaf) => new CalendarView(leaf, this));

        this.addCommand({
            id: "active-calendar-view",
            name: "打开日历视图",
            callback: () => {
                DustCalendarPlugin.activateCalendarView(this);
            }
        });

        this.addSettingTab(this.mainSettingTab);

        if (this.app.workspace.layoutReady) {
            await DustCalendarPlugin.activateCalendarView(this);
        }
    }

    // 关闭插件的时候执行释放资源的操作
    onunload() {
        this.database.saveSetting();
        this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR).forEach((leaf) => leaf.detach());
    }

    private static async activateCalendarView(plugin: Plugin): Promise<void> {
        const {workspace} = plugin.app;

        // 检查该类型的视图是否存在，如果不存在，则创建
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
        if (leaves.length > 0) {
            leaf = leaves[0];
        }
        else {
            leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({type: VIEW_TYPE_CALENDAR, active: true});
        }

        // 显示视图
        workspace.revealLeaf(leaf);
    }

    // 强制刷新日历页面
    public flushCalendarView(): void {
        const {workspace} = this.app;

        // 检查该类型的视图是否存在，如果不存在，则创建
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
        if (leaves.length > 0) {
            leaf = leaves[0];
            (leaf.view as CalendarView).flush();
        }
    }
}

