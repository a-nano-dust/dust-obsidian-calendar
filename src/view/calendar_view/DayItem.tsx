import {useContext} from "react";
import {MainControllerContext} from "../../base/context";
import DayListOfMonthView from "../../entity/DayListOfMonthView";
import {DayItemFooterType, SelectedItemType} from "../../base/enum";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectSelectedItem, updateSelectedItem} from "../../redux/selectedItemSlice";
import SelectedItem from "../../entity/SelectedItem";
import {updateShowItem} from "../../redux/showItemSlice";
import {DateTime} from "luxon";
import {HolidayUtil} from "lunar-typescript";
import {DayItemFooterEntity} from "../../entity/DayItemFooterEntity";
import {selectToday} from "../../redux/todaySlice";


function DayItemBody({
                         targetDay,
                         dayListOfMonthView,
                         isSelected
                     }: { targetDay: DateTime, dayListOfMonthView: DayListOfMonthView, isSelected: boolean }) {

    let today = useAppSelector(selectToday);

    let style = "month-view-item-body";
    if (isSelected) {
        style = "month-view-item-body month-view-item-body-selected";
    }
    else if (targetDay.month !== dayListOfMonthView.month) {
        style = "month-view-item-body month-view-non-current-month-item";
    }
    else if (targetDay.hasSame(today, 'year') && targetDay.hasSame(today, 'month') && targetDay.hasSame(today, 'day')) {
        style = "month-view-item-body month-view-day-item-body-today";
    }

    return <div className={style}>
        {targetDay.day}
        <DayItemSuperscript targetDate={targetDay} dayListOfMonthView={dayListOfMonthView}/>
    </div>
}

function DayItemSuperscript({targetDate, dayListOfMonthView} : {targetDate : DateTime, dayListOfMonthView: DayListOfMonthView}) {

    let holiday = HolidayUtil.getHoliday(targetDate.year, targetDate.month, targetDate.day);
    if (holiday === null) {
        return <></>;
    }

    if (holiday.isWork()) {
        if (targetDate.month !== dayListOfMonthView.month) {
            return <sup className="month-view-day-item-sup month-view-day-item-sup-working-day month-view-non-current-month-item">{'班'}</sup>
        }
        return <sup className="month-view-day-item-sup month-view-day-item-sup-working-day">{'班'}</sup>
    }

    if (targetDate.month !== dayListOfMonthView.month) {
        return <sup className="month-view-day-item-sup month-view-day-item-sup-rest-day month-view-non-current-month-item">{'休'}</sup>
    }
    return <sup className="month-view-day-item-sup month-view-day-item-sup-rest-day">{'休'}</sup>
}

function DayItemFooter({targetDay, dayListOfMonthView, isSelected} : {targetDay : DateTime, dayListOfMonthView: DayListOfMonthView, isSelected: boolean}) {


    let dayItemFooter = new DayItemFooterEntity(targetDay);

    let style = "month-view-day-item-footer";
    if (isSelected) {
        style = "month-view-day-item-footer month-view-day-item-footer-selected";
    }
    else if (targetDay.month !== dayListOfMonthView.month) {
        style = "month-view-day-item-footer month-view-day-item-footer-non-current-month";
    }
    else if (dayItemFooter.type === DayItemFooterType.FESTIVAL || dayItemFooter.type === DayItemFooterType.SOLAR_TERM) {
        style = "month-view-day-item-footer month-view-day-item-footer-important";
    }
    return <div className={style}>{dayItemFooter.text}</div>
}

export default function DayItem({targetDay, dayListOfMonthView} : {targetDay : DateTime, dayListOfMonthView: DayListOfMonthView}) {

    let dispatch = useAppDispatch();
    let selectedItem = useAppSelector(selectSelectedItem);
    let mainController = useContext(MainControllerContext)!;


    let style = "month-view-item";
    let isSelected: boolean = selectedItem.type === SelectedItemType.DAY_ITEM && selectedItem.date.year === targetDay.year && selectedItem.date.month === targetDay.month && selectedItem.date.day === targetDay.day;
    if (isSelected) {
        style = "month-view-item month-view-item-selected";
    }
    let newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.DAY_ITEM;
    newSelectItem.date = targetDay;

    let onClickCallback = () => {
        dispatch(updateSelectedItem(newSelectItem));
    }
    if (targetDay.month !== dayListOfMonthView.month) {
        onClickCallback = () => {
            dispatch(updateSelectedItem(newSelectItem));
            dispatch(updateShowItem(targetDay));
        };
    }

    if (mainController.hasDailyNote(DateTime.local(targetDay.year, targetDay.month, targetDay.day))) {
        return <div className={style} onClick={onClickCallback} onDoubleClick={() => mainController.openFileBySelectedItem(newSelectItem)}>
            <DayItemBody targetDay={targetDay} dayListOfMonthView={dayListOfMonthView} isSelected={isSelected} />
            <DayItemFooter targetDay={targetDay} dayListOfMonthView={dayListOfMonthView} isSelected={isSelected} />
            <div className="month-view-dot"></div>
        </div>
    }

    return <div className={style} onClick={onClickCallback} onDoubleClick={() => mainController.openFileBySelectedItem(newSelectItem)}>
        <DayItemBody targetDay={targetDay} dayListOfMonthView={dayListOfMonthView} isSelected={isSelected} />
        <DayItemFooter targetDay={targetDay} dayListOfMonthView={dayListOfMonthView} isSelected={isSelected}/>
        <div className="month-view-no-dot">&nbsp;</div>
    </div>
}
