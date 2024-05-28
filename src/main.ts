import {App, Plugin, PluginManifest} from 'obsidian';
import {CalendarView, VIEW_TYPE_CALENDAR} from './view/CalendarView';
import MainSettingTable from "./setting/MainSettingTable";
import MainController from "./core/MainController";


// 插件对象
export default class DustCalendarPlugin extends Plugin {

    private readonly mainController: MainController;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.mainController = new MainController(this);
    }

    // 插件开启时执行初始化操作
    async onload() {
        // 加载插件设置
        await this.mainController.loadSettings();
        // 注册日历视图
        this.registerView(VIEW_TYPE_CALENDAR, (leaf) => new CalendarView(leaf, this.mainController));

        this.addCommand({
            id: "active-calendar-view",
            name: "打开日历视图",
            callback: () => {
                this.mainController.activateCalendarView();
            }
        });

        this.addSettingTab(new MainSettingTable(this.mainController));

        if (this.app.workspace.layoutReady) {
            this.mainController.activateCalendarView();
        }

        // const commandId = "ID";
        // const commands = (this.app as any).commands;
        // const commandExist = commands.listCommands().some((cmd: any) => cmd.id === commandId);
        // commands.executeCommandById("ID");

        // console.log("app: ",this.app);
        // console.log("app.commands: ",(this.app as any).commands);
        // console.log("app.commands.commands: ",(this.app as any).commands.commands);
        //
        // for (let key of Object.keys((this.app as any).commands.commands)) {
        //     console.log(key);
        // }

        // const commands = (this.app as any).commands.commands;
        //
        // console.log(commands.commands);
        // commands.forEach((e: any) => console.log(e.id));
    }

    // 关闭插件的时候执行释放资源的操作
    onunload() {
        this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR).forEach((leaf) => leaf.detach());
    }
}

