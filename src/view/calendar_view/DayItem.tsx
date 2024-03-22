import {useContext} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectSelectedItem, updateSelectedItem} from "../../redux/selectedItemSlice";
import {selectToday} from "../../redux/todaySlice";
import {MainControllerContext} from "../../base/context";
import {DateTime} from "luxon";
import {HolidayUtil} from "lunar-typescript";
import DayListOfMonthView from "../../entity/DayListOfMonthView";
import {DayItemFooterType, NoteType, SelectedItemType} from "../../base/enum";
import SelectedItem from "../../entity/SelectedItem";
import {DayItemFooterEntity} from "../../entity/DayItemFooterEntity";


function DayItemBody({
                         targetDay,
                         dayListOfMonthView,
                         isSelected
                     }: { targetDay: DateTime, dayListOfMonthView: DayListOfMonthView, isSelected: boolean }) {

    let today = useAppSelector(selectToday);

    let style = "month-view-item-body";
    if (isSelected) {
        style = "month-view-item-body month-view-item-body-selected";
    } else if (targetDay.month !== dayListOfMonthView.month) {
        style = "month-view-item-body month-view-non-current-month-item";
    } else if (targetDay.hasSame(today, 'year') && targetDay.hasSame(today, 'month') && targetDay.hasSame(today, 'day')) {
        style = "month-view-item-body month-view-day-item-body-today";
    }

    return <div className={style}>
        {targetDay.day}
        <DayItemSuperscript targetDate={targetDay} dayListOfMonthView={dayListOfMonthView}/>
    </div>
}

function DayItemSuperscript({
                                targetDate,
                                dayListOfMonthView
                            }: { targetDate: DateTime, dayListOfMonthView: DayListOfMonthView }) {

    let holiday = HolidayUtil.getHoliday(targetDate.year, targetDate.month, targetDate.day);
    if (holiday === null) {
        return <></>;
    }

    if (holiday.isWork()) {
        if (targetDate.month !== dayListOfMonthView.month) {
            return <sup
                className="month-view-day-item-sup month-view-day-item-sup-working-day month-view-non-current-month-item">{'班'}</sup>
        }
        return <sup className="month-view-day-item-sup month-view-day-item-sup-working-day">{'班'}</sup>
    }

    if (targetDate.month !== dayListOfMonthView.month) {
        return <sup
            className="month-view-day-item-sup month-view-day-item-sup-rest-day month-view-non-current-month-item">{'休'}</sup>
    }
    return <sup className="month-view-day-item-sup month-view-day-item-sup-rest-day">{'休'}</sup>
}

function DayItemFooter({
                           targetDay,
                           dayListOfMonthView,
                           isSelected
                       }: { targetDay: DateTime, dayListOfMonthView: DayListOfMonthView, isSelected: boolean }) {


    let dayItemFooter = new DayItemFooterEntity(targetDay);

    let style = "month-view-day-item-footer";
    if (isSelected) {
        style = "month-view-day-item-footer month-view-day-item-footer-selected";
    } else if (targetDay.month !== dayListOfMonthView.month) {
        style = "month-view-day-item-footer month-view-day-item-footer-non-current-month";
    } else if (dayItemFooter.type === DayItemFooterType.FESTIVAL || dayItemFooter.type === DayItemFooterType.SOLAR_TERM) {
        style = "month-view-day-item-footer month-view-day-item-footer-important";
    }
    return <div className={style}>{dayItemFooter.text}</div>
}

export default function DayItem({
                                    targetDay,
                                    dayListOfMonthView
                                }: { targetDay: DateTime, dayListOfMonthView: DayListOfMonthView }) {

    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const mainController = useContext(MainControllerContext)!;

    // 每个日期都可能被选中，提前创建对象以便更新
    const newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.DAY_ITEM;
    newSelectItem.date = targetDay;

    // 点击日期会更新已选中对象
    let onClickCallback = () => {
        dispatch(updateSelectedItem(newSelectItem));
    }

    // 被选中和未被选中日期的背景颜色不同
    let bodyStyle = "calendar-view-item d-hover-bg-color-base-50";
    const isSelected: boolean = selectedItem.type === SelectedItemType.DAY_ITEM && selectedItem.date.year === targetDay.year && selectedItem.date.month === targetDay.month && selectedItem.date.day === targetDay.day;
    if (isSelected) {
        bodyStyle = "calendar-view-item d-bg-color-blue";
    }

    // 有关联笔记的日期会使用一个点进行标注
    let dotStyle = "calendar-view-no-dot";
    if (mainController.hasNote(DateTime.local(targetDay.year, targetDay.month, targetDay.day), NoteType.DAILY)) {
        dotStyle = "calendar-view-dot";
    }

    return <div className={bodyStyle} onClick={onClickCallback}
                onDoubleClick={() => mainController.openFileBySelectedItem(newSelectItem)}>
        <DayItemBody targetDay={targetDay} dayListOfMonthView={dayListOfMonthView} isSelected={isSelected}/>
        <DayItemFooter targetDay={targetDay} dayListOfMonthView={dayListOfMonthView} isSelected={isSelected}/>
        <div className={dotStyle}></div>
    </div>
}
