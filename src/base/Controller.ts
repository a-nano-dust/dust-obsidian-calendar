import {
  MarkdownView,
  Notice,
  TFile,
  WorkspaceLeaf,
  normalizePath,
} from "obsidian";
import { get, merge } from "lodash-es";
import { IPluginSetting } from "./interface";
import DustCalendarPlugin from "../main";
import ConfirmModal from "../view/ConfirmModal";
import { CalendarView, VIEW_TYPE_CALENDAR } from "../view/CalendarView";
import { Dayjs } from "dayjs";
import { NoteKey } from "./enum";

export default class Controller {
  private readonly _plugin: DustCalendarPlugin;
  private _setting: IPluginSetting;

  constructor(plugin: DustCalendarPlugin) {
    this._plugin = plugin;
    this._setting = {
      [NoteKey.DAILY]: { open: false, format: "YYYY-MM-DD", folder: "日记" },
      [NoteKey.WEEKLY]: { open: false, format: "YYYY-[W]ww", folder: "周记" },
      [NoteKey.MONTHLY]: { open: false, format: "YYYY-MM", folder: "月度总结" },
      [NoteKey.QUARTERLY]: {
        open: false,
        format: "YYYY-[Q]Q",
        folder: "季度总结",
      },
      [NoteKey.YEARLY]: { open: false, format: "YYYY", folder: "年度总结" },
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
  }

  // 保存配置
  async saveSettings() {
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
      if (leaf) {
        leaf
          .setViewState({ type: VIEW_TYPE_CALENDAR, active: true })
          .then(() => {});
      }
    }

    // 显示视图
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
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

  // 打开或者创建文件
  // 如果存在则打开
  // 否则创建
  public openOrCreatFile(date: Dayjs, type: NoteKey): void {
    const { open, folder, format } = this._setting[type];
    if (!open) {
      // 未开启
      return;
    }
    const path = this.getPath(date, folder, format);
    const file = this.noteIsExistsByPath(path);
    if (file !== null) {
      // 笔记存在
      this.openFile(file);
    } else {
      // 笔记不存在, 调用弹窗，然后再创建
      const modal = new ConfirmModal(path, folder, this);
      modal.open();
      // this.createFile(path, folder);
    }
  }

  // 生成路径
  public getPath(date: Dayjs, folder: string, format: string): string {
    return normalizePath(`${folder}/${date.format(format)}.md`);
  }

  // 判断笔记是否存在
  public noteIsExists(date: Dayjs, type: NoteKey): boolean {
    const { open, folder, format } = this._setting[type];
    if (!open) {
      return false;
    }
    const path = this.getPath(date, folder, format);
    return this.noteIsExistsByPath(path) !== null;
  }
  public noteIsExistsByPath(path: string): TFile | null {
    const { app } = this._plugin;
    const vault = app.vault;
    return vault.getFileByPath(path);
  }

  // 打开文件
  public openFile(file: TFile): void {
    const { app } = this._plugin;

    // 寻找已打开的标签页
    let targetView: MarkdownView | null = null;
    app.workspace.iterateRootLeaves((leaf) => {
      if (
        leaf.getViewState().type === "markdown" &&
        leaf.getDisplayText() === file.basename
      ) {
        let view = leaf.view as MarkdownView;
        if (
          view.file !== null &&
          view.file.path === file.path &&
          targetView === null
        ) {
          targetView = view;
        }
      }
    });

    if (targetView === null) {
      targetView = new MarkdownView(app.workspace.getLeaf("tab"));
      const targetLeaf: WorkspaceLeaf = targetView.leaf;
      targetLeaf.openFile(file).then(() => {});
    }
    app.workspace.revealLeaf(targetView.leaf);
  }

  // 创建文件
  public createFile(path: string, folder: string): void {
    const { app } = this._plugin;
    const vault = app.vault;
    if (vault.getFolderByPath(folder) === null) {
      vault.createFolder(folder);
    }
    vault.create(path, "").then(
      (file) => {
        this.openFile(file);
      },
      () => new Notice("".concat('创建"', path, '"失败'))
    );
  }
}
