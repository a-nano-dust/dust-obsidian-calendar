import {DateTime} from "luxon";
import {DayItemFooterType} from "../base/enum";
import {Solar} from "lunar-typescript";

export class DayItemFooterEntity {

    text : string;
    type : DayItemFooterType;

    constructor(date : DateTime) {

        let lunar = Solar.fromYmd(date.year, date.month, date.day).getLunar();

        // 优先显示节日
        let festivals = lunar.getFestivals();
        if (festivals.length !== 0) {
            this.text = festivals[0];
            this.type = DayItemFooterType.FESTIVAL;
            return;
        }

        // 次优先节气
        let solarTerm = lunar.getJieQi();
        if (solarTerm.length !== 0) {
            this.text = solarTerm;
            this.type = DayItemFooterType.SOLAR_TERM;
            return;
        }

        // 再优先显示月份
        if (lunar.getDay() === 1) {
            this.text = lunar.getMonthInChinese().concat('月');
            this.type = DayItemFooterType.MONTH;
            return;
        }

        // 日期的显示优先级最低
        this.text = lunar.getDayInChinese();
        this.type = DayItemFooterType.DAY;
    }


}