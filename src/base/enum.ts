export enum NoteType {
    DAILY = 1,                  // 日更笔记
    WEEKLY = 2,                 // 周更笔记
    MONTHLY = 3,                // 月更笔记
    QUARTERLY = 4,              // 季更笔记
    YEARLY = 5                  // 年更笔记
}

export enum CalendarViewType {
    MONTH = 1,
    YEAR = 2
}

export enum WeekEnum {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 7
}

export enum SelectedItemType {
    NONE = 0,
    DAY_ITEM = 1,
    WEEK_INDEX_ITEM = 2,
    MONTH_ITEM = 3,
    QUARTER_ITEM = 4,
    YEAR_ITEM = 5
}


export enum DayItemFooterType {
    MONTH = 1,
    DAY = 2,
    SOLAR_TERM = 3,
    FESTIVAL = 4
}
