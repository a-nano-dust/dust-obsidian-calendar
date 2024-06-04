import {FontSizeChangeMode, QuarterNameMode, TemplatePlugin} from "../base/enum";

export default class PluginSetting {

    fontSizeChangeMode: FontSizeChangeMode;
    immutableFontSizeFactor: number;

    quarterNameMode: QuarterNameMode;

    templatePlugin: TemplatePlugin;

    dailyNoteOption: boolean;
    dailyNotePattern: string;
    dailyTemplateFilename: string;

    weeklyNoteOption: boolean;
    weeklyNotePattern: string;
    weeklyTemplateFilename: string;

    monthlyNoteOption: boolean;
    monthlyNotePattern: string;
    monthlyTemplateFilename: string;

    quarterlyNoteOption: boolean;
    quarterlyNotePattern: string;
    quarterlyTemplateFilename: string;

    yearlyNoteOption: boolean;
    yearlyNotePattern: string;
    yearlyTemplateFilename: string;

    constructor() {

        this.fontSizeChangeMode = FontSizeChangeMode.IMMUTABLE;
        this.immutableFontSizeFactor = 1;

        this.quarterNameMode = QuarterNameMode.NUMBER;

        this.templatePlugin = TemplatePlugin.NONE;

        this.dailyNoteOption = false;
        this.dailyNotePattern = "";
        this.dailyTemplateFilename = "";

        this.weeklyNoteOption = false;
        this.weeklyNotePattern = "";
        this.weeklyTemplateFilename = "";

        this.monthlyNoteOption = false;
        this.monthlyNotePattern = "";
        this.monthlyTemplateFilename = "";

        this.quarterlyNoteOption = false;
        this.quarterlyNotePattern = "";
        this.quarterlyTemplateFilename = "";

        this.yearlyNoteOption = false;
        this.yearlyNotePattern = "";
        this.yearlyTemplateFilename = "";
    }

}
