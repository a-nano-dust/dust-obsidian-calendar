import { WorkspaceLeaf } from "obsidian";
import { merge } from "lodash-es";
import { IPluginSetting } from "./interface";
import DustCalendarPlugin from "../main";
import { CalendarView, VIEW_TYPE_CALENDAR } from "../view/CalendarView";

export default class Controller {
  private readonly _plugin: DustCalendarPlugin;
  private _setting: IPluginSetting;

  constructor(plugin: DustCalendarPlugin) {
    this._plugin = plugin;
    this._setting = {
      daily: { open: false, format: "YYYY-MM-DD", folder: "日记" },
      weekly: { open: false, format: "YYYY-[W]ww", folder: "周记" },
      monthly: { open: false, format: "YYYY-MM", folder: "月度总结"},
      quarterly: { open: false, format: "YYYY-[Q]Q", folder: "季度总结" },
      yearly: { open: false, format: "YYYY", folder: "年度总结" },
    };
  }

  get plugin(): DustCalendarPlugin {
    return this._plugin;
  }

  get setting(): IPluginSetting {
    return this._setting;
  }

  set setting(pluginSetting: IPluginSetting) {
    this._setting = pluginSetting;
  }

  // 加载配置
  async loadSettings() {
    this._setting = merge({}, this._setting, await this._plugin.loadData());

    console.log("this._setting", this._setting, this._plugin);
  }

  // 保存配置
  async saveSettings() {
    console.log("saveSettings", this._setting);
    await this._plugin.saveData(this._setting);
  }

  // 激活日历视图
  activateCalendarView(): void {
    const { workspace } = this.plugin.app;

    // 检查该类型的视图是否存在，如果不存在，则创建
    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
    if (leaves.length > 0) {
      leaf = leaves[0];
      console.log("leaves.length > 0");
    } else {
      console.log("else");
      leaf = workspace.getRightLeaf(false);
      if (leaf === null) {
        console.log("leaf is null");
      } else {
        console.log("leaf is not null");
      }
      leaf
        .setViewState({ type: VIEW_TYPE_CALENDAR, active: true })
        .then(() => {});
    }

    // 显示视图
    workspace.revealLeaf(leaf);
  }

  // 强制刷新日历页面
  public flushCalendarView(): void {
    const { workspace } = this.plugin.app;

    // 检查该类型的视图是否存在，如果不存在，则创建
    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
    if (leaves.length > 0) {
      leaf = leaves[0];
      (leaf.view as CalendarView).flush();
    }
  }
}
