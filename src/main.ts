import { App, Plugin, PluginManifest } from "obsidian";
import { CalendarView, VIEW_TYPE_CALENDAR } from "./view/CalendarView";
import SettingView from "./view/SettingView";
import Controller from "./base/Controller";

// 配置时间插件
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/zh-cn";

dayjs.extend(advancedFormat);
dayjs.extend(quarterOfYear);
dayjs.extend(weekOfYear);
dayjs.locale("zh-CN");

// 插件对象
export default class DustCalendarPlugin extends Plugin {
  private readonly controller: Controller;
  private flushCalendarView;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.controller = new Controller(this);
    this.flushCalendarView = () => this.controller.flushCalendarView();
  }

  // 插件开启时执行初始化操作
  async onload() {
    // 加载插件设置
    await this.controller.loadSettings();
    // 注册日历视图
    this.registerView(
      VIEW_TYPE_CALENDAR,
      (leaf) => new CalendarView(leaf, this.controller)
    );

    this.addCommand({
      id: "active-calendar-view",
      name: "打开日历视图",
      callback: () => {
        this.controller.activateCalendarView();
      },
    });

    this.addSettingTab(new SettingView(this.controller));

    if (this.app.workspace.layoutReady) {
      this.controller.activateCalendarView();
    }

    // 添加监听
    this.app.vault.on("create", this.flushCalendarView);
    this.app.vault.on("delete", this.flushCalendarView);
    this.app.vault.on("rename", this.flushCalendarView);
  }

  // 关闭插件的时候执行释放资源的操作
  onunload() {
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE_CALENDAR)
      .forEach((leaf) => leaf.detach());
    // 去除监听
    this.app.vault.off("create", this.flushCalendarView);
    this.app.vault.off("delete", this.flushCalendarView);
    this.app.vault.off("rename", this.flushCalendarView);
  }
}
