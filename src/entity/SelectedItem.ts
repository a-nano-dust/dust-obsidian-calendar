import {SelectedItemType} from "../base/enum";
import {DateTime} from "luxon";

export default class SelectedItem {
    type : SelectedItemType;
    date : DateTime;

    constructor() {
        this.type = SelectedItemType.NONE;
        this.date = DateTime.now();
    }
}