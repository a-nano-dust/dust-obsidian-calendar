import { App, Plugin, PluginManifest } from "obsidian";
import { CalendarView, VIEW_TYPE_CALENDAR } from "./view/CalendarView";
import SettingView from "./view/SettingView";
import Controller from "./base/Controller";

// 配置时间插件
import dayjs from "dayjs";
import * as weekOfYear from "dayjs/plugin/weekOfYear"; // 导入插件
import * as advancedFormat from "dayjs/plugin/advancedFormat"; // 导入插件
import "dayjs/locale/zh-cn";
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.locale("zh-CN");

// 插件对象
export default class DustCalendarPlugin extends Plugin {
  private readonly controller: Controller;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.controller = new Controller(this);
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
  }

  // 关闭插件的时候执行释放资源的操作
  onunload() {
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE_CALENDAR)
      .forEach((leaf) => leaf.detach());
  }
}
