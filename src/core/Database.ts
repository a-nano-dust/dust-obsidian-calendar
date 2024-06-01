import DustCalendarPlugin from "../main";
import PluginSetting from "../entity/PluginSetting";
import {QuarterNameMode} from "../base/enum";


export default class Database {

    public readonly plugin: DustCalendarPlugin;
    public setting: PluginSetting;

    private quarterNameMap: Map<number, string>;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.setting = new PluginSetting();
        this.quarterNameMap = new Map;
        this.updateQuarterNameMap();
    }

    public async loadSetting(): Promise<void> {
        this.setting = await this.plugin.loadData() as PluginSetting;
        this.updateQuarterNameMap();
    }

    public async saveSetting(): Promise<void> {
        await this.plugin.saveData(this.setting);
    }

    public flush(): void {
        this.updateQuarterNameMap();
    }

    public parseQuarterName(quarterIndex: number): string {
        return this.quarterNameMap?.get(quarterIndex)!;
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
        this.quarterNameMap = newQuarterNameMap;
    }
}