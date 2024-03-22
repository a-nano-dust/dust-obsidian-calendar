import DayListOfMonthView from "../../entity/DayListOfMonthView";
import MonthView from "./MonthView";
import {useAppSelector} from "../../redux/hooks";
import CalendarViewHeader from "./CalendarViewHeader";
import YearView from "./YearView";
import {selectCalendarViewType} from "../../redux/calendarViewType";
import {CalendarViewType} from "../../base/enum"
import {selectSelectedItem} from "../../redux/selectedItemSlice";

export default function CalendarViewImpl() {
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedDate = selectedItem.date;
    const calendarViewType = useAppSelector(selectCalendarViewType);

    if (calendarViewType === CalendarViewType.MONTH) {
        const dayListOfMonthView: DayListOfMonthView = new DayListOfMonthView(selectedDate.year, selectedDate.month);
        return <>
            <CalendarViewHeader/>
            <MonthView dayListOfMonthView={dayListOfMonthView}/>
        </>
    } else {
        return <>
            <CalendarViewHeader/>
            <YearView showYear={selectedDate.year}/>
        </>
    }


}