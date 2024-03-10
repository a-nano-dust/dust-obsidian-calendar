import {App, PluginSettingTab, Setting} from "obsidian";
import {createRoot, Root} from "react-dom/client";
import DailyNotePattern from "./DailyNotePattern";
import MainController from "../core/MainController";


export default class MainSettingTable extends PluginSettingTab {

    mainController : MainController;
    dairyPatternRoot: Root | null;

    constructor(mainController : MainController) {
        super(mainController.plugin.app, mainController.plugin);
        this.mainController = mainController;
        this.dairyPatternRoot = null;
    }

    display(): any {
        const {containerEl} = this;
        containerEl.empty();
        new Setting(containerEl).nameEl.createEl("h1", {text: "日历配置"});
        this.dairySetting();
    }

    hide(): any {
        this.mainController.saveSettings().then(() => {});
        return super.hide();
    }

    private dairySetting(): void {

        const {containerEl} = this;

        let dairyOption = new Setting(containerEl);
        dairyOption.nameEl.createEl("h2", {text: "日记"});
        dairyOption.addToggle(toggle => {
        });

        let dairyPattern = new Setting(containerEl);
        dairyPattern.settingEl.empty();
        this.dairyPatternRoot = createRoot(dairyPattern.settingEl);
        this.dairyPatternRoot.render(
            <DailyNotePattern mainController={this.mainController}/>
        );
    }
}