import {StrictMode} from "react";
import {createRoot, Root} from "react-dom/client";
import {Provider} from "react-redux";
import {ItemView, WorkspaceLeaf} from "obsidian";
import {store} from "./redux/store";
import CalendarViewImpl from "./calendar_view/CalendarViewImpl";
import DustCalendarPlugin from "../main";
import {PluginContext} from "./context";


export const VIEW_TYPE_CALENDAR = "calendar-view";


export class CalendarView extends ItemView {

    private readonly plugin: DustCalendarPlugin;
    // private readonly mainController: MainController;
    private root: Root | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: DustCalendarPlugin) {
        // constructor(leaf: WorkspaceLeaf, mainController: MainController) {
        super(leaf);
        this.plugin = plugin;
        // this.mainController = mainController;
        this.icon = "lucide-calendar-check";
    }

    // 视图类型
    getViewType() {
        return VIEW_TYPE_CALENDAR;
    }

    getDisplayText() {
        return "日历";
    }

    // 打开时的初始化操作
    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);
        this.root.render(
            <StrictMode>
                <PluginContext.Provider value={this.plugin}>
                    {/*<MainControllerContext.Provider value={this.mainController}>*/}
                    <Provider store={store}>
                        <CalendarViewImpl/>
                    </Provider>
                </PluginContext.Provider>
                {/*</MainControllerContext.Provider>*/}
            </StrictMode>,
        );
    }

    public flush() {
        if (this.root === null) {
            return;
        }
        this.root.render(
            <StrictMode>
                <PluginContext.Provider value={this.plugin}>
                    {/*<MainControllerContext.Provider value={this.mainController}>*/}
                    <Provider store={store}>
                        <CalendarViewImpl/>
                    </Provider>
                </PluginContext.Provider>
                {/*</MainControllerContext.Provider>*/}
            </StrictMode>,
        );
    }

    // 关闭时的资源释放操作
    async onClose() {
        this.root?.unmount();
    }
}
