export default class PluginSetting {

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
