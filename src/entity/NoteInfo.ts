import {DateTime} from "luxon";
import {NoteType} from "../base/enum";

export default class NoteInfo {
    dateTime : DateTime;            // 日期
    noteType : NoteType;            // 笔记类型
    wordCount : number;             // 字数统计

    constructor() {
        this.dateTime = DateTime.now();
        this.noteType = NoteType.DAILY;
        this.wordCount = 100;
    }
}