import DustCalendarPlugin from "../main";
import {FontSizeChangeMode, QuarterNameMode} from "../base/enum";


export default class ViewController {

    public readonly plugin: DustCalendarPlugin;
    private quarterNameMap: Map<number, string>;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.quarterNameMap = new Map;
        this.updateQuarterNameMap();
    }

    public getFontSizeChangeMode(): FontSizeChangeMode {
        return this.plugin.database.setting.fontSizeChangeMode;
    }

    public setFontSizeChangeMode(fontSizeChangeMode: FontSizeChangeMode): void {
        this.plugin.database.setting.fontSizeChangeMode = fontSizeChangeMode;
    }

    public getImmutableFontSizeFactor(): number {
        return this.plugin.database.setting.immutableFontSizeFactor;
    }

    public setImmutableFontSizeFactor(immutableFontSizeFactor: number): void {
        this.plugin.database.setting.immutableFontSizeFactor = immutableFontSizeFactor;
    }

    public getQuarterNameMode(): QuarterNameMode {
        return this.plugin.database.setting.quarterNameMode;
    }

    public setQuarterNameMode(quarterNameMode: QuarterNameMode): void {
        this.plugin.database.setting.quarterNameMode = quarterNameMode;
        this.updateQuarterNameMap();
    }

    public parseQuarterName(quarterIndex: number): string {
        return this.quarterNameMap?.get(quarterIndex)!;
    }

    private updateQuarterNameMap() {
        let newQuarterNameMap = new Map();
        if (this.plugin.database.setting.quarterNameMode === QuarterNameMode.NUMBER) {
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