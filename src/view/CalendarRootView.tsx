import {StrictMode} from "react";
import {createRoot, Root} from "react-dom/client";
import {Provider} from "react-redux";
import {ItemView, WorkspaceLeaf} from "obsidian";
import {MainControllerContext} from "../base/context";
import {store} from "../redux/store";
import CalendarView from "./CalendarView";
import MainController from "../core/MainController";


export const VIEW_TYPE_CALENDAR = "calendar-view";


export class CalendarRootView extends ItemView {

    private readonly mainController : MainController;
    private root: Root | null = null;

    constructor(leaf: WorkspaceLeaf, mainController : MainController) {
        super(leaf);
        this.mainController = mainController;
    }

    // 视图类型
    getViewType() {
        return VIEW_TYPE_CALENDAR;
    }

    getDisplayText() {
        return "Calendar view";
    }

    // 打开时的初始化操作
    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);
        this.root.render(
            <StrictMode>
                <MainControllerContext.Provider value={this.mainController} >
                    <Provider store={store}>
                        <CalendarView/>
                    </Provider>
                </MainControllerContext.Provider>
            </StrictMode>,
        );
    }

    // 关闭时的资源释放操作
    async onClose() {
        this.root?.unmount();
    }
}
