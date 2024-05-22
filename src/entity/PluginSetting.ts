import {FontSizeChangeMode, QuarterNameMode} from "../base/enum";

export default class PluginSetting {

    fontSizeChangeMode: FontSizeChangeMode;
    immutableFontSizeFactor: number;

    quarterNameMode: QuarterNameMode;

    dailyNoteOption: boolean;
    dailyNotePattern: string;

    weeklyNoteOption: boolean;
    weeklyNotePattern: string;

    monthlyNoteOption: boolean;
    monthlyNotePattern: string;

    quarterlyNoteOption: boolean;
    quarterlyNotePattern: string;

    yearlyNoteOption: boolean;
    yearlyNotePattern: string;

    constructor() {

        this.fontSizeChangeMode = FontSizeChangeMode.IMMUTABLE;
        this.immutableFontSizeFactor = 1;

        this.quarterNameMode = QuarterNameMode.NUMBER;

        this.dailyNoteOption = false;
        this.dailyNotePattern = "";

        this.weeklyNoteOption = false;
        this.weeklyNotePattern = "";

        this.monthlyNoteOption = false;
        this.monthlyNotePattern = "";

        this.quarterlyNoteOption = false;
        this.quarterlyNotePattern = "";

        this.yearlyNoteOption = false;
        this.yearlyNotePattern = "";
    }

}
