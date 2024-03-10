import DayListOfMonthView from "../entity/DayListOfMonthView";
import {WeekEnum} from "../base/enum";
import DayItem from "./DayItem";
import WeekIndexItem from "./WeekIndexItem";

export default function MonthViewRow({
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


    return <div className='month-view-row'>
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