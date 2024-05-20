import {FontSizeChangeMode} from "../base/enum";

export default class PluginSetting {

    fontSizeChangeMode: FontSizeChangeMode;
    immutableFontSizeFactor: number;

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
