import {WorkspaceLeaf} from 'obsidian';
import DustCalendarPlugin from "../main";
import {CalendarView, VIEW_TYPE_CALENDAR} from "../view/CalendarView";


/**
 * 有很多逻辑都需要刷新日历界面，为避免刷新过快，带来性能方面的影响
 * 所有的刷新请求都需要交给 CalendarViewController 处理，由它来控制刷新的频率
 */
export class CalendarViewController {

    public readonly plugin: DustCalendarPlugin;
    private requestCounter: number;                             // 请求刷新的次数
    private lastRequestTime: number;                            // 上次请求时间

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.requestCounter = 0;
        this.lastRequestTime = 0;
    }

    public getShouldDisplayLunarInfo(): boolean {
        return this.plugin.database.setting.shouldDisplayLunarInfo;
    }

    public setShouldDisplayLunarInfo(shouldDisplayLunarInfo: boolean) {
        this.plugin.database.setting.shouldDisplayLunarInfo = shouldDisplayLunarInfo;
    }

    public getShouldDisplayHolidayInfo(): boolean {
        return this.plugin.database.setting.shouldDisplayHolidayInfo;
    }

    public setShouldDisplayHolidayInfo(shouldDisplayHolidayInfo: boolean): boolean {
        return this.plugin.database.setting.shouldDisplayHolidayInfo = shouldDisplayHolidayInfo;
    }


    // 立即刷新
    public forceFlush(): void {
        const {workspace} = this.plugin.app;

        // 检查该类型的视图是否存在，如果不存在，则创建
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
        if (leaves.length > 0) {
            leaf = leaves[0];
            (leaf.view as CalendarView).flush();
        }
    }

    /**
     * 请求刷新
     * 如果某个地方调用了请求刷新函数，就表示它需要刷新日历界面，但处于性能考虑，并不需要立即刷新
     * 默认情况下，该函数会在调用1秒之后刷新界面，在此期间，如果该函数再次被调用，那么刷新时间会继续向后顺延1秒
     */
    public requestFlush(): void {
        this.requestCounter = this.requestCounter + 1;
        this.lastRequestTime = performance.now();
        setTimeout(() => {
            if (this.requestCounter <= 0) {
                return;
            }
            const now = performance.now();
            if (now - this.lastRequestTime < 990) {
                return;
            }
            this.requestCounter = 0;
            this.forceFlush();
        }, 1000);
    }


}