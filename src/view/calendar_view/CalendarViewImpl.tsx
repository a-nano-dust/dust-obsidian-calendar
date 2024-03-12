import DayListOfMonthView from "../../entity/DayListOfMonthView";
import MonthView from "./MonthView";
import {useAppSelector} from "../../redux/hooks";
import {selectShowItem} from "../../redux/showItemSlice";

export default function CalendarViewImpl() {
    let showItem = useAppSelector(selectShowItem);
    let dayListOfMonthView: DayListOfMonthView = new DayListOfMonthView(showItem.year, showItem.month);
    return <MonthView dayListOfMonthView={dayListOfMonthView}/>
}