import {PluginSettingTab, Setting} from "obsidian";
import {createRoot, Root} from "react-dom/client";
import DailyNotePattern from "./DailyNotePattern";
import MainController from "../core/MainController";
import WeeklyNotePattern from "./WeeklyNotePattern";
import QuarterlyNotePattern from "./QuarterlyNotePattern";
import MonthlyNotePattern from "./MonthlyNotePattern";
import YearlyNotePattern from "./YearlyNotePattern";
import ImmutableFontSizeSlider from "./ImmutableFontSizeSlider";
import FontSizeChangeModeSelect from "./FontSizeChangeModeSelect";
import {FontSizeChangeMode} from "../base/enum";


export default class MainSettingTable extends PluginSettingTab {

    mainController: MainController;
    fontSizeChangeModeSelectRoot: Root | null;
    immutableFontSizeSliderRoot: Root | null;
    dailyNotePatternRoot: Root | null;
    weeklyNotePatternRoot: Root | null;
    monthlyNotePatternRoot: Root | null;
    quarterlyNotePatternRoot: Root | null;
    yearlyNotePatternRoot: Root | null;

    constructor(mainController: MainController) {
        super(mainController.plugin.app, mainController.plugin);
        this.mainController = mainController;
        this.fontSizeChangeModeSelectRoot = null;
        this.immutableFontSizeSliderRoot = null;
        this.dailyNotePatternRoot = null;
        this.weeklyNotePatternRoot = null;
        this.monthlyNotePatternRoot = null;
        this.quarterlyNotePatternRoot = null;
        this.yearlyNotePatternRoot = null;
    }

    display(): any {
        const {containerEl} = this;
        containerEl.empty();
        this.displayFontSizeChangeModeSelect();
        this.displayImmutableFontSizeSlider();
        this.displayDailyNoteSetting();
        this.displayWeeklyNoteSetting();
        this.displayMonthlyNoteSetting();
        this.displayQuarterlyNoteSetting();
        this.displayYearlyNoteSetting();
    }

    hide(): any {
        this.mainController.saveSettings().then(() => this.mainController.flushCalendarView());
        return super.hide();
    }

    private displayFontSizeChangeModeSelect(): void {
        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.fontSizeChangeModeSelectRoot = createRoot(settingComponent.settingEl);
        this.fontSizeChangeModeSelectRoot.render(
            <FontSizeChangeModeSelect mainController={this.mainController} mainSettingTable={this}/>
        );
    }

    private displayImmutableFontSizeSlider(): void {

        if (this.mainController.setting.fontSizeChangeMode !== FontSizeChangeMode.IMMUTABLE) {
            return;
        }

        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.immutableFontSizeSliderRoot = createRoot(settingComponent.settingEl);
        this.immutableFontSizeSliderRoot.render(
            <ImmutableFontSizeSlider mainController={this.mainController}/>
        );
    }

    private displayDailyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("每日笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.mainController.setting.dailyNoteOption);
            toggle.onChange(async (value) => {
                this.mainController.setting.dailyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.dailyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.dailyNotePatternRoot.render(
            <DailyNotePattern mainController={this.mainController}/>
        );
    }

    private displayWeeklyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("每周笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.mainController.setting.weeklyNoteOption);
            toggle.onChange(async (value) => {
                this.mainController.setting.weeklyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.weeklyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.weeklyNotePatternRoot.render(
            <WeeklyNotePattern mainController={this.mainController}/>
        );
    }

    private displayMonthlyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("每月笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.mainController.setting.monthlyNoteOption);
            toggle.onChange(async (value) => {
                this.mainController.setting.monthlyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.weeklyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.weeklyNotePatternRoot.render(
            <MonthlyNotePattern mainController={this.mainController}/>
        );
    }

    private displayQuarterlyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("季度笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.mainController.setting.quarterlyNoteOption);
            toggle.onChange(async (value) => {
                this.mainController.setting.quarterlyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.quarterlyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.quarterlyNotePatternRoot.render(
            <QuarterlyNotePattern mainController={this.mainController}/>
        );
    }

    private displayYearlyNoteSetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.setName("年度笔记").setHeading();
        dairyOption.addToggle(toggle => {
            toggle.setValue(this.mainController.setting.yearlyNoteOption);
            toggle.onChange(async (value) => {
                this.mainController.setting.yearlyNoteOption = value;
            });
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.yearlyNotePatternRoot = createRoot(dairyPattern.settingEl);
        this.yearlyNotePatternRoot.render(
            <YearlyNotePattern mainController={this.mainController}/>
        );
    }


}