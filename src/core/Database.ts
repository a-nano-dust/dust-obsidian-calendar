import DustCalendarPlugin from "../main";
import PluginSetting from "../entity/PluginSetting";


/**
 * 类似于底层数据库，不允许界面直接读写，只能通过 controller 间接控制
 */
export default class Database {

    public readonly plugin: DustCalendarPlugin;
    public setting: PluginSetting;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.setting = new PluginSetting();
    }

    public async loadSetting(): Promise<void> {
        this.setting = Object.assign({}, this.setting, await this.plugin.loadData());
    }

    public async saveSetting(): Promise<void> {
        await this.plugin.saveData(this.setting);
    }
}