import {PluginSettingTab, Setting} from "obsidian";
import {createRoot, Root} from "react-dom/client";
import {FontSizeChangeMode, NoteType, TemplatePlugin} from "../../base/enum";
import DustCalendarPlugin from "../../main";
import ImmutableFontSizeSlider from "./ImmutableFontSizeSlider";
import FontSizeChangeModeSelect from "./FontSizeChangeModeSelect";
import QuarterNameModeSelect from "./QuarterNameModeSelect";
import TemplatePluginSelect from "./TemplatePluginSelect";
import NoteTemplate from "./NoteTemplate";
import NotePattern from "./NotePattern";


export default class MainSettingTab extends PluginSettingTab {

    private plugin: DustCalendarPlugin;
    private fontSizeChangeModeSelectRoot: Root | null;
    private immutableFontSizeSliderRoot: Root | null;
    private quarterNameModeSelectRoot: Root | null;
    private templatePluginSelectRoot: Root | null;
    private dailyNotePatternRoot: Root | null;
    private dailyNoteTemplateRoot: Root | null;
    private weeklyNotePatternRoot: Root | null;
    private weeklyNoteTemplateRoot: Root | null;
    private monthlyNotePatternRoot: Root | null;
    private monthlyNoteTemplateRoot: Root | null;
    private quarterlyNotePatternRoot: Root | null;
    private quarterlyNoteTemplateRoot: Root | null;
    private yearlyNotePatternRoot: Root | null;
    private yearlyNoteTemplateRoot: Root | null;

    constructor(plugin: DustCalendarPlugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
        this.fontSizeChangeModeSelectRoot = null;
        this.immutableFontSizeSliderRoot = null;
        this.quarterNameModeSelectRoot = null;
        this.templatePluginSelectRoot = null;
        this.dailyNotePatternRoot = null;
        this.dailyNoteTemplateRoot = null;
        this.weeklyNotePatternRoot = null;
        this.weeklyNoteTemplateRoot = null;
        this.monthlyNotePatternRoot = null;
        this.monthlyNoteTemplateRoot = null;
        this.quarterlyNotePatternRoot = null;
        this.quarterlyNoteTemplateRoot = null;
        this.yearlyNotePatternRoot = null;
        this.yearlyNoteTemplateRoot = null;
    }

    display(): any {
        const {containerEl} = this;
        containerEl.empty();
        this.displayFontSizeChangeModeSelect();
        this.displayImmutableFontSizeSlider();
        this.displayQuarterNameModeSelect();
        this.displayTemplatePluginSelect();

        this.displayNoteSetting(NoteType.DAILY, "每日笔记", this.dailyNotePatternRoot, this.dailyNoteTemplateRoot);
        this.displayNoteSetting(NoteType.WEEKLY, "每周笔记", this.weeklyNotePatternRoot, this.weeklyNoteTemplateRoot);
        this.displayNoteSetting(NoteType.MONTHLY, "每月笔记", this.monthlyNotePatternRoot, this.monthlyNoteTemplateRoot);
        this.displayNoteSetting(NoteType.QUARTERLY, "季度笔记", this.quarterlyNotePatternRoot, this.quarterlyNoteTemplateRoot);
        this.displayNoteSetting(NoteType.YEARLY, "年度笔记", this.yearlyNotePatternRoot, this.yearlyNoteTemplateRoot);
    }

    async hide(): Promise<any> {
        await this.plugin.database.saveSetting();
        this.plugin.flushCalendarView();
        return super.hide();
    }

    private displayFontSizeChangeModeSelect(): void {
        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.fontSizeChangeModeSelectRoot = createRoot(settingComponent.settingEl);
        this.fontSizeChangeModeSelectRoot.render(
            <FontSizeChangeModeSelect plugin={this.plugin}/>
        );
    }

    private displayImmutableFontSizeSlider(): void {

        if (this.plugin.database.setting.fontSizeChangeMode !== FontSizeChangeMode.IMMUTABLE) {
            return;
        }

        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.immutableFontSizeSliderRoot = createRoot(settingComponent.settingEl);
        this.immutableFontSizeSliderRoot.render(
            <ImmutableFontSizeSlider plugin={this.plugin}/>
        );
    }

    private displayQuarterNameModeSelect(): void {
        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.quarterNameModeSelectRoot = createRoot(settingComponent.settingEl);
        this.quarterNameModeSelectRoot.render(
            <QuarterNameModeSelect plugin={this.plugin}/>
        );
    }

    private displayTemplatePluginSelect(): void {
        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.templatePluginSelectRoot = createRoot(settingComponent.settingEl);
        this.templatePluginSelectRoot.render(
            <TemplatePluginSelect plugin={this.plugin}/>
        );
    }

    private displayNoteSetting(noteType: NoteType, title: string, notePatternRoot: Root | null, noteTemplateRoot: Root | null): void {
        const {containerEl} = this;

        const noteOption = this.plugin.noteController.getNoteOption(noteType);

        let noteOptionElement = new Setting(containerEl);
        noteOptionElement.setName(title).setHeading();
        noteOptionElement.addToggle(toggle => {
            toggle.setValue(noteOption);
            toggle.onChange(async (value) => {
                this.plugin.noteController.setNoteOption(noteType, value);
                this.display();
            });
        });

        if (!noteOption) {
            return;
        }

        let notePatternElement = new Setting(containerEl);
        notePatternElement.settingEl.empty();
        notePatternRoot = createRoot(notePatternElement.settingEl);
        notePatternRoot.render(
            <NotePattern plugin={this.plugin} noteType={noteType}/>
        );

        // 是否选择了模板插件
        if (this.plugin.templateController.getTemplatePlugin() === TemplatePlugin.NONE) {
            return;
        }

        // 指定的模板插件是否启用
        if (!this.plugin.templateController.isTemplatePluginEnable()) {
            return;
        }

        let noteTemplateElement = new Setting(containerEl);
        noteTemplateElement.settingEl.empty();
        noteTemplateRoot = createRoot(noteTemplateElement.settingEl);
        noteTemplateRoot.render(
            <NoteTemplate plugin={this.plugin} noteType={noteType}/>
        );
    }
}