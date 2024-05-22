import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
// import {Provider} from "react-redux";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { MainControllerContext } from "../base/context";
// import {store} from "../redux/store";
// import CalendarViewImpl from "./calendar_view/CalendarViewImpl";
import Calendar from "./component/Calendar";
import MainController from "../core/MainController";
import { ConfigProvider } from "antd";
import zhCN from 'antd/locale/zh_CN';

export const VIEW_TYPE_CALENDAR = "calendar-view";

export class CalendarView extends ItemView {
  private readonly mainController: MainController;
  private root: Root | null = null;
  theme: {};

  constructor(leaf: WorkspaceLeaf, mainController: MainController) {
    super(leaf);
    this.mainController = mainController;
    this.icon = "lucide-calendar-check";
		// console.log(this.app.getTheme());
    this.theme = {
			token: {
				colorPrimary: this.app.getAccentColor(),
			},
			components: {
				Calendar: {
					fullBg: 'transparent',
					fullPanelBg: 'transparent',
				},
			},
		};
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
        <MainControllerContext.Provider value={this.mainController}>
          <ConfigProvider theme={this.theme} locale={zhCN}>
            <Calendar />
          </ConfigProvider>
        </MainControllerContext.Provider>
      </StrictMode>
    );
  }

  public flush() {
    if (this.root === null) {
      return;
    }
    this.root.render(
      <StrictMode>
        <MainControllerContext.Provider value={this.mainController}>
          <ConfigProvider theme={this.theme} locale={zhCN}>
            <Calendar />
          </ConfigProvider>
        </MainControllerContext.Provider>
      </StrictMode>
    );
  }

  // 关闭时的资源释放操作
  async onClose() {
    this.root?.unmount();
  }
}
