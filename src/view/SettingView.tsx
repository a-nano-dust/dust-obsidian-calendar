import { PluginSettingTab, Setting } from "obsidian";
import dayjs from "dayjs";

import Controller from "../base/Controller";
import { NoteKey } from "src/base/enum";
import { createRoot } from "react-dom/client";
import NoteInput from "../component/NoteInput";
import { get, set } from "lodash-es";

export interface INoteConfigItem {
  title: string;
  key: NoteKey;
}

const noteConfigMap = {
  [NoteKey.DAILY]: {
    title: "日更笔记",
    key: NoteKey.DAILY,
  },
  [NoteKey.WEEKLY]: {
    title: "周更笔记",
    key: NoteKey.WEEKLY,
  },
  [NoteKey.MONTHLY]: {
    title: "月更笔记",
    key: NoteKey.MONTHLY,
  },
  [NoteKey.QUARTERLY]: {
    title: "季更笔记",
    key: NoteKey.QUARTERLY,
  },
  [NoteKey.YEARLY]: {
    title: "年更笔记",
    key: NoteKey.YEARLY,
  },
};

export default class MainSettingTable extends PluginSettingTab {
  controller: Controller;

  constructor(controller: Controller) {
    super(controller.plugin.app, controller.plugin);
    this.controller = controller;
  }

  display(): any {
    const { containerEl } = this;
    containerEl.empty();
    [
      noteConfigMap[NoteKey.DAILY],
      noteConfigMap[NoteKey.WEEKLY],
      noteConfigMap[NoteKey.MONTHLY],
      noteConfigMap[NoteKey.QUARTERLY],
      noteConfigMap[NoteKey.YEARLY],
    ].map((v) => this.displayNoteSetting(v));
  }

  setSetting<T>(path: string, value: T) {
    set(this.controller.setting, path, value);
  }

  getSetting(path: string) {
    return get(this.controller.setting, path);
  }

  saveSettings() {
    this.controller.saveSettings();
    this.display()
  }

  hide(): any {
    this.controller
      .saveSettings()
      .then(() => this.controller.flushCalendarView());
    return super.hide();
  }

  private displayNoteSetting(noteConfigItem: INoteConfigItem): void {
    const { containerEl } = this;

    containerEl.createEl("h3", { text: noteConfigItem.title });

    new Setting(containerEl)
      .setName(`是否开启${noteConfigItem.title}`)
      .setDesc("不开启则点击无反应，不影响展示")
      .addToggle((toggle) => {
        toggle.setValue(this.getSetting(`${noteConfigItem.key}.open`));
        toggle.onChange(async (value) => {
          this.setSetting(`${noteConfigItem.key}.open`, value);
          this.saveSettings()
        });
      });

    let formatDom = new Setting(containerEl);
    formatDom.settingEl.empty();
    const format = this.getSetting(`${noteConfigItem.key}.format`);
    const text = dayjs().format(format);
    createRoot(formatDom.settingEl).render(
      <NoteInput
        title="文件名格式"
        subTitle={
          <>
            <div>
              请使用&nbsp;
              <a href="https://day.js.org/docs/zh-CN/display/format">
                Day.js语法
              </a>
              &nbsp;指定笔记文件的文件名
            </div>
            <div>规则应用后的文件名为(基于当前日期)：<b>{text}</b></div>
          </>
        }
        value={format}
        onChange={(value: string) => {
          this.setSetting(`${noteConfigItem.key}.format`, value);
        }}
        onBulr={() => this.saveSettings()}
      />
    );

    let folderDom = new Setting(containerEl);
    folderDom.settingEl.empty();
    const folder = this.getSetting(`${noteConfigItem.key}.folder`);
    createRoot(folderDom.settingEl).render(
      <NoteInput
        title="文件夹"
        subTitle={
          <>
            <div>笔记文件存放的文件夹</div>
          </>
        }
        value={folder}
        onChange={(value: string) => {
          this.setSetting(`${noteConfigItem.key}.folder`, value);
        }}
        onBulr={() => this.saveSettings()}
      />
    );
  }
}
