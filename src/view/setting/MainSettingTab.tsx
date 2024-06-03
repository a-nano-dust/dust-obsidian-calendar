import {PluginSettingTab, Setting} from "obsidian";
import {createRoot, Root} from "react-dom/client";
import {FontSizeChangeMode, NoteType, TemplatePlugin} from "../../base/enum";
import DustCalendarPlugin from "../../main";
import DailyNotePattern from "./DailyNotePattern";
import WeeklyNotePattern from "./WeeklyNotePattern";
import QuarterlyNotePattern from "./QuarterlyNotePattern";
import MonthlyNotePattern from "./MonthlyNotePattern";
import YearlyNotePattern from "./YearlyNotePattern";
import ImmutableFontSizeSlider from "./ImmutableFontSizeSlider";
import FontSizeChangeModeSelect from "./FontSizeChangeModeSelect";
import QuarterNameModeSelect from "./QuarterNameModeSelect";
import TemplatePluginSelect from "./TemplatePluginSelect";
import NoteTemplate from "./NoteTemplate";


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
        this.displayDailyNoteSetting();
        this.displayWeeklyNoteSetting();
        this.displayMonthlyNoteSetting();
        this.displayQuarterlyNoteSetting();
        this.displayYearlyNoteSetting();
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

        console.log("displayTemplatePluginSelect");
        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.templatePluginSelectRoot = createRoot(settingComponent.settingEl);
        this.templatePluginSelectRoot.render(
            <TemplatePluginSelect plugin={this.plugin}/>
        );
    }

    private displayDailyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("每日笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.plugin.database.setting.dailyNoteOption);
            toggle.onChange(async (value) => {
                this.plugin.database.setting.dailyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.dailyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.dailyNotePatternRoot.render(
            <DailyNotePattern plugin={this.plugin}/>
        );

        if (this.plugin.database.setting.templatePlugin !== TemplatePlugin.NONE) {
            let dailyNoteTemplate = new Setting(containerEl);
            dailyNoteTemplate.settingEl.empty();
            this.dailyNoteTemplateRoot = createRoot(dailyNoteTemplate.settingEl);
            this.dailyNoteTemplateRoot.render(
                // <DailyNoteTemplate plugin={this.plugin}/>
                <NoteTemplate plugin={this.plugin} noteType={NoteType.DAILY}/>
            );
        }
    }

    private displayWeeklyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("每周笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.plugin.database.setting.weeklyNoteOption);
            toggle.onChange(async (value) => {
                this.plugin.database.setting.weeklyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.weeklyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.weeklyNotePatternRoot.render(
            <WeeklyNotePattern plugin={this.plugin}/>
        );

        if (this.plugin.database.setting.templatePlugin !== TemplatePlugin.NONE) {
            let weeklyNoteTemplate = new Setting(containerEl);
            weeklyNoteTemplate.settingEl.empty();
            this.weeklyNoteTemplateRoot = createRoot(weeklyNoteTemplate.settingEl);
            this.weeklyNoteTemplateRoot.render(
                <NoteTemplate plugin={this.plugin} noteType={NoteType.WEEKLY}/>
            );
        }
    }

    private displayMonthlyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("每月笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.plugin.database.setting.monthlyNoteOption);
            toggle.onChange(async (value) => {
                this.plugin.database.setting.monthlyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.weeklyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.weeklyNotePatternRoot.render(
            <MonthlyNotePattern plugin={this.plugin}/>
        );

        if (this.plugin.database.setting.templatePlugin !== TemplatePlugin.NONE) {
            let monthlyNoteTemplate = new Setting(containerEl);
            monthlyNoteTemplate.settingEl.empty();
            this.monthlyNoteTemplateRoot = createRoot(monthlyNoteTemplate.settingEl);
            this.monthlyNoteTemplateRoot.render(
                <NoteTemplate plugin={this.plugin} noteType={NoteType.MONTHLY}/>
            );
        }
    }

    private displayQuarterlyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("季度笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.plugin.database.setting.quarterlyNoteOption);
            toggle.onChange(async (value) => {
                this.plugin.database.setting.quarterlyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.quarterlyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.quarterlyNotePatternRoot.render(
            <QuarterlyNotePattern plugin={this.plugin}/>
        );

        if (this.plugin.database.setting.templatePlugin !== TemplatePlugin.NONE) {
            let quarterlyNoteTemplate = new Setting(containerEl);
            quarterlyNoteTemplate.settingEl.empty();
            this.quarterlyNoteTemplateRoot = createRoot(quarterlyNoteTemplate.settingEl);
            this.quarterlyNoteTemplateRoot.render(
                <NoteTemplate plugin={this.plugin} noteType={NoteType.QUARTERLY}/>
            );
        }
    }

    private displayYearlyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("年度笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.plugin.database.setting.yearlyNoteOption);
            toggle.onChange(async (value) => {
                this.plugin.database.setting.yearlyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.yearlyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.yearlyNotePatternRoot.render(
            <YearlyNotePattern plugin={this.plugin}/>
        );

        if (this.plugin.database.setting.templatePlugin !== TemplatePlugin.NONE) {
            let yearlyNoteTemplate = new Setting(containerEl);
            yearlyNoteTemplate.settingEl.empty();
            this.yearlyNoteTemplateRoot = createRoot(yearlyNoteTemplate.settingEl);
            this.yearlyNoteTemplateRoot.render(
                <NoteTemplate plugin={this.plugin} noteType={NoteType.YEARLY}/>
            );
        }
    }


}