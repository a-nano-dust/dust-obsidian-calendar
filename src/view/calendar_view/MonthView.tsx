import {MouseEvent, useContext} from "react";
import {DateTime} from "luxon";
import {HolidayUtil} from "lunar-typescript";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectSelectedItem, updateSelectedItem} from "../redux/selectedItemSlice";
import SelectedItem from "../../entity/SelectedItem";
import {DayItemFooterEntity} from "../../entity/DayItemFooterEntity";
import DayListOfMonthView from "../../entity/DayListOfMonthView";
import {DayItemFooterType, NoteType, SelectedItemType, WeekEnum} from "../../base/enum";
import {PluginContext} from "../context";
import {range} from "../../util/util";
import StatisticLabel from "./StatisticLabel";


function DayItemBody({
                         targetDay,
                         dayListOfMonthView,
                         isSelected
                     }: { targetDay: DateTime, dayListOfMonthView: DayListOfMonthView, isSelected: boolean }) {


    const plugin = useContext(PluginContext)!;

    const today = DateTime.now();

    let style = "d-normal-font";
    if (isSelected) {
        style = style.concat(" d-color-base-100");
    }
    else if (targetDay.month !== dayListOfMonthView.month) {
        style = style.concat(" d-opacity-20");
    }
    else if (targetDay.hasSame(today, 'year') && targetDay.hasSame(today, 'month') && targetDay.hasSame(today, 'day')) {
        style = style.concat(" d-color-blue");
    }

    return <div className={style}>
        {targetDay.day}
        {
            plugin.calendarViewController.getShouldDisplayHolidayInfo()
                ? <DayItemSuperscript targetDate={targetDay} dayListOfMonthView={dayListOfMonthView}/>
                : <></>
        }
    </div>
}

function DayItemSuperscript({
                                targetDate,
                                dayListOfMonthView,

                            }: { targetDate: DateTime, dayListOfMonthView: DayListOfMonthView }) {

    let holiday = HolidayUtil.getHoliday(targetDate.year, targetDate.month, targetDate.day);
    if (holiday === null) {
        return <></>;
    }


    let style = "d-script-font";
    let text: string;
    if (targetDate.month !== dayListOfMonthView.month) {
        style = style.concat(" d-opacity-20");
    }

    if (holiday.isWork()) {
        style = style.concat(" d-color-red");
        text = "班";
    }
    else {
        style = style.concat(" d-color-green");
        text = "休";
    }

    return <sup className={style}>{text}</sup>
}

function DayItemFooter({
                           targetDay,
                           dayListOfMonthView,
                           isSelected
                       }: { targetDay: DateTime, dayListOfMonthView: DayListOfMonthView, isSelected: boolean }) {


    let dayItemFooter = new DayItemFooterEntity(targetDay);

    let style = "d-script-font";
    if (isSelected) {
        style = style.concat(" d-color-base-100");
    }
    else if (targetDay.month !== dayListOfMonthView.month) {
        style = style.concat(" d-opacity-20");
    }
    else if (dayItemFooter.type === DayItemFooterType.FESTIVAL || dayItemFooter.type === DayItemFooterType.SOLAR_TERM) {
        style = style.concat(" d-color-blue");
    }

    return <div className={style}>{dayItemFooter.text}</div>
}

function DayItem({
                     targetDay,
                     dayListOfMonthView
                 }: { targetDay: DateTime, dayListOfMonthView: DayListOfMonthView }) {

    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const plugin = useContext(PluginContext)!;

    // 每个日期都可能被选中，提前创建对象以便更新
    const newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.DAY_ITEM;
    newSelectItem.date = targetDay;

    // 点击日期会更新已选中对象
    const onClickCallback = (e: MouseEvent<HTMLDivElement>) => {
        // 如果发生连击，只有第一次点击才会切换选中对象，并且能够避免干扰双击事件
        if (e.detail === 1) {
            dispatch(updateSelectedItem(newSelectItem));
        }
    }

    // 被选中和未被选中日期的背景颜色不同
    let bodyStyle = "calendar-view-item d-hover-bg-color-base-50";
    const isSelected: boolean = selectedItem.type === SelectedItemType.DAY_ITEM && selectedItem.date.year === targetDay.year && selectedItem.date.month === targetDay.month && selectedItem.date.day === targetDay.day;
    if (isSelected) {
        bodyStyle = "calendar-view-item d-bg-color-blue";
    }

    return <div className={bodyStyle} onClick={onClickCallback}
                onDoubleClick={() => plugin.noteController.openNoteBySelectedItem(selectedItem)}>
        <DayItemBody targetDay={targetDay} dayListOfMonthView={dayListOfMonthView} isSelected={isSelected}/>
        {
            plugin.calendarViewController.getShouldDisplayLunarInfo()
                ? <DayItemFooter targetDay={targetDay} dayListOfMonthView={dayListOfMonthView} isSelected={isSelected}/>
                : <></>
        }
        <StatisticLabel date={DateTime.local(targetDay.year, targetDay.month, targetDay.day)}
                        noteType={NoteType.DAILY}/>
    </div>
}

function WeekIndexItem({targetDay}: { targetDay: DateTime }) {
    let dispatch = useAppDispatch();
    let selectedItem = useAppSelector(selectSelectedItem);
    const plugin = useContext(PluginContext)!;

    let newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.WEEK_INDEX_ITEM;
    newSelectItem.date = targetDay;

    // 点击日期会更新已选中对象
    const onClickCallback = (e: MouseEvent<HTMLDivElement>) => {
        // 如果发生连击，只有第一次点击才会切换选中对象，并且能够避免干扰双击事件
        if (e.detail === 1) {
            dispatch(updateSelectedItem(newSelectItem));
        }
    }

    let itemStyle = "calendar-view-item d-hover-bg-color-base-50";
    let itemBodyStyle = "d-bold-font";
    if (selectedItem.type === SelectedItemType.WEEK_INDEX_ITEM && selectedItem.date.weekNumber === targetDay.weekNumber) {
        itemStyle = "calendar-view-item d-bg-color-blue";
    }

    return <div className={itemStyle} style={{fontWeight: "bold"}} onClick={onClickCallback}
                onDoubleClick={() => plugin.noteController.openNoteBySelectedItem(newSelectItem)}>
        <div className={itemBodyStyle}>{targetDay.weekNumber}</div>
        <StatisticLabel date={DateTime.local(targetDay.year, targetDay.month, targetDay.day)}
                        noteType={NoteType.WEEKLY}/>
    </div>
}


function MonthViewRow({
                          dayListOfMonthView,
                          weekIndex
                      }: { dayListOfMonthView: DayListOfMonthView, weekIndex: number }) {

    let monday = dayListOfMonthView.getDayByWeek(weekIndex, WeekEnum.MONDAY);
    let tuesday = dayListOfMonthView.getDayByWeek(weekIndex, WeekEnum.TUESDAY);
    let wednesday = dayListOfMonthView.getDayByWeek(weekIndex, WeekEnum.WEDNESDAY);
    let thursday = dayListOfMonthView.getDayByWeek(weekIndex, WeekEnum.THURSDAY);
    let friday = dayListOfMonthView.getDayByWeek(weekIndex, WeekEnum.FRIDAY);
    let saturday = dayListOfMonthView.getDayByWeek(weekIndex, WeekEnum.SATURDAY);
    let sunday = dayListOfMonthView.getDayByWeek(weekIndex, WeekEnum.SUNDAY);


    return <div className='calendar-view-row'>
        <WeekIndexItem targetDay={monday}/>
        <DayItem targetDay={monday} dayListOfMonthView={dayListOfMonthView}/>
        <DayItem targetDay={tuesday} dayListOfMonthView={dayListOfMonthView}/>
        <DayItem targetDay={wednesday} dayListOfMonthView={dayListOfMonthView}/>
        <DayItem targetDay={thursday} dayListOfMonthView={dayListOfMonthView}/>
        <DayItem targetDay={friday} dayListOfMonthView={dayListOfMonthView}/>
        <DayItem targetDay={saturday} dayListOfMonthView={dayListOfMonthView}/>
        <DayItem targetDay={sunday} dayListOfMonthView={dayListOfMonthView}/>
    </div>
}

function MonthViewHeader() {
    return <div className='calendar-view-row'>
        <div className="calendar-view-item d-hover-bg-color-base-50 d-bold-font">周</div>
        <div className="calendar-view-item d-hover-bg-color-base-50 d-bold-font">一</div>
        <div className="calendar-view-item d-hover-bg-color-base-50 d-bold-font">二</div>
        <div className="calendar-view-item d-hover-bg-color-base-50 d-bold-font">三</div>
        <div className="calendar-view-item d-hover-bg-color-base-50 d-bold-font">四</div>
        <div className="calendar-view-item d-hover-bg-color-base-50 d-bold-font">五</div>
        <div className="calendar-view-item d-hover-bg-color-base-50 d-bold-font">六</div>
        <div className="calendar-view-item d-hover-bg-color-base-50 d-bold-font">日</div>
    </div>
}

export default function MonthView({dayListOfMonthView}: { dayListOfMonthView: DayListOfMonthView }) {

    let totalWeeks: number = dayListOfMonthView.totalWeeks;

    return <div className="calendar-view-body">
        <MonthViewHeader/>
        {
            range(0, totalWeeks).map((v) => {
                return <MonthViewRow dayListOfMonthView={dayListOfMonthView} weekIndex={v} key={v}/>
            })
        }
    </div>
}