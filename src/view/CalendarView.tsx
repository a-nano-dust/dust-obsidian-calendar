import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { ControllerContext } from "../base/context";
import Controller from "../base/Controller";
// 配置 antd
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import Calendar from "../component/Calendar";

export const VIEW_TYPE_CALENDAR = "calendar-view";

export class CalendarView extends ItemView {
  private readonly controller: Controller;
  private root: Root | null = null;
  theme: {};

  constructor(leaf: WorkspaceLeaf, controller: Controller) {
    super(leaf);
    this.controller = controller;
    this.icon = "lucide-calendar-check";
    // console.log(this.app.getTheme());
    this.theme = {
      token: {
        colorPrimary: (this.app as any).getAccentColor(),
      },
      components: {
        Calendar: {
          fullBg: "transparent",
          fullPanelBg: "transparent",
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
        <ControllerContext.Provider value={this.controller}>
          <ConfigProvider theme={this.theme} locale={zhCN}>
            <Calendar time={0} />
          </ConfigProvider>
        </ControllerContext.Provider>
      </StrictMode>
    );
  }

  public flush() {
    if (this.root === null) {
      return;
    }
    const time = Date.now();
    this.root.render(
      <StrictMode>
        <ControllerContext.Provider value={this.controller}>
          <ConfigProvider theme={this.theme} locale={zhCN}>
            <Calendar time={time} />
          </ConfigProvider>
        </ControllerContext.Provider>
      </StrictMode>
    );
  }

  // 关闭时的资源释放操作
  async onClose() {
    this.root?.unmount();
  }
}
