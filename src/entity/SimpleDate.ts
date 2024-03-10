import {Solar, Lunar, HolidayUtil, Holiday, SolarWeek} from 'lunar-typescript';


/**
 * 基本的日期对象
 */
export default class SimpleDate {

    private _solar : Solar;                                         // 阳历日期对象
    private _dayInWeek : number | null;                             // 公历：周几，[1,7]
    private _weekIndexInYear : number | null;                       // 周序号，当前周是本年度的第几周

    // 法定节假日相关字段
    private _isHoliday : boolean | null;                            // 是否属于法定节假日期间
    private _isWorkingDay : boolean | null;                         // 调休：班
    private _isRestDay : boolean | null;                            // 调休：休

    // 农历相关字段
    private _chineseYear : string | null;                           // 农历：年
    private _chineseMonth : string | null;                          // 农历：月
    private _chineseDayInMonth : string | null;                     // 农历：日
    private _festival : string | null;                              // 节日
    private _solarTerm : string | null;                             // 节气

    // 构造函数将所有字段全部赋空值
    constructor(year : number, month : number, dayInMonth : number) {

        this._solar = Solar.fromYmd(year, month, dayInMonth);

        // 暂时不需要读取的字段全部置为空，等读取的时候再计算具体的值，提高性能
        this._dayInWeek = null;
        this._weekIndexInYear = null;
        this._isHoliday = null;
        this._isWorkingDay = null;
        this._isRestDay = null;
        this._chineseYear = null;
        this._chineseMonth = null;
        this._chineseDayInMonth = null;
        this._festival = null;
        this._solarTerm = null;
    }

    static today() : SimpleDate {
        let today = Solar.fromDate(new Date());
        // let today : Date = new Date();
        return new SimpleDate(today.getYear(), today.getMonth(), today.getDay());
    }

    // 更新周几字段
    private updateDayInWeekField() : void {
        if (this._dayInWeek !== null) {
            return;
        }

        this._dayInWeek = this._solar.getWeek();
        if (this._dayInWeek === 0) {
            this._dayInWeek = 7;
        }
    }

    // 更新周序号字段
    private updateWeekIndexInYear(): void {
        if (this._weekIndexInYear !== null) {
            return;
        }

        let solarWeek = SolarWeek.fromYmd(this.year, this.month, this.dayInMonth, 1);
        this._weekIndexInYear = solarWeek.getIndexInYear();
    }

    // 更新节假日相关字段
    private updateHolidayField(): void {
        if (this._isHoliday !== null) {
            return
        }

        let holiday : Holiday | null = HolidayUtil.getHoliday(this.year, this.month, this.dayInMonth);
        this._isHoliday = holiday !== null;
        if (this._isHoliday) {
            this._isWorkingDay = holiday!.isWork();
            this._isRestDay = !this.isWorkingDay;
        }
        else {
            this._isWorkingDay = false;
            this._isRestDay = false;
        }
    }

    // 更新阴历相关字段
    private updateLunarField(): void {
        if (this._chineseYear !== null) {
            return;
        }

        let lunar : Lunar = this._solar.getLunar();
        this._chineseYear = lunar.getYearInChinese();
        this._chineseMonth = lunar.getMonthInChinese();
        this._chineseDayInMonth = lunar.getDayInChinese();

        let tempFestival : string[] = lunar.getFestivals();
        if (tempFestival.length === 0) {
            this._festival = null;
        }
        else {
            this._festival = tempFestival[0];
        }

        this._solarTerm = lunar.getJieQi();
        if (this._solarTerm.length === 0) {
            this._solarTerm = null;
        }
    }

    get year(): number {
        return this._solar.getYear();
    }

    get month(): number {
        return this._solar.getMonth();
    }

    get dayInMonth(): number {
        return this._solar.getDay();
    }

    get dayInWeek(): number {
        this.updateDayInWeekField();
        return <number>this._dayInWeek;
    }

    get weekIndexInYear(): number {
        this.updateWeekIndexInYear();
        return <number>this._weekIndexInYear;
    }

    get quarter(): number {
        return (this._solar.getMonth() - 1) / 3;
    }

    get isWeekday(): boolean {
        this.updateDayInWeekField();
        return <number>this.dayInWeek <= 5;
    }

    get isWeekend(): boolean {
        this.updateDayInWeekField();
        return <number>this.dayInWeek > 5;
    }

    get isHoliday(): boolean {
        this.updateHolidayField();
        return this._isHoliday!;
    }

    get isWorkingDay(): boolean {
        this.updateHolidayField();
        return this._isWorkingDay!;
    }

    get isRestDay(): boolean {
        this.updateHolidayField();
        return this._isRestDay!;
    }

    get chineseYear(): string {
        this.updateLunarField();
        return this._chineseYear!;
    }

    get chineseMonth(): string {
        this.updateLunarField();
        return this._chineseMonth!;
    }

    get chineseDayInMonth(): string {
        this.updateLunarField();
        return this._chineseDayInMonth!;
    }

    get festival(): string {
        this.updateLunarField();
        return this._festival!;
    }

    get solarTerm(): string {
        this.updateLunarField();
        return this._solarTerm!;
    }

    equals(another : SimpleDate) : boolean {
        return this.year === another.year && this.month === another.month && this.dayInMonth === another.dayInMonth;
    }
}