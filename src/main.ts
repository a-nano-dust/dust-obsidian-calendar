import {App, Notice, Plugin, PluginManifest, WorkspaceLeaf} from 'obsidian';
import {CalendarRootView, VIEW_TYPE_CALENDAR} from './view/CalendarRootView';
import MainSettingTable from "./setting/MainSettingTable";
import MainController from "./core/MainController";


// 插件对象
export default class DustDiaryPlugin extends Plugin {

    private readonly mainController : MainController;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.mainController = new MainController(this);
    }

    // 插件开启时执行初始化操作
    async onload() {
        // 加载插件设置
        await this.mainController.loadSettings();
        // 注册日历视图
        this.registerView(VIEW_TYPE_CALENDAR, (leaf) => new CalendarRootView(leaf, this.mainController));

        // 在左侧工具栏添加一个图标
        const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
            new Notice('Hello World!');
            this.activateView();
        });
        ribbonIconEl.addClass('my-plugin-ribbon-class');

        // 在底部状态条添加一个组件
        const statusBarItemEl = this.addStatusBarItem();
        statusBarItemEl.setText('Status Bar Text');

        // 在插件设置界面添加一项
        this.addSettingTab(new MainSettingTable(this.mainController));
        // this.addSettingTab(new DustDiarySettingTab(this.app, this));
    }

    // 关闭插件的时候执行释放资源的操作
    onunload() {

    }

    async activateView() {
    	const { workspace } = this.app;

        // 检查该类型的视图是否存在，如果不存在，则创建
    	let leaf: WorkspaceLeaf | null = null;
    	const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
    	if (leaves.length > 0) {
    		leaf = leaves[0];
    	}
    	else {
    		leaf = workspace.getRightLeaf(false);
    		await leaf.setViewState({ type: VIEW_TYPE_CALENDAR, active: true });
    	}

    	// 显示视图
    	workspace.revealLeaf(leaf);
    }

}

