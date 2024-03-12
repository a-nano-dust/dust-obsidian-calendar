import MonthViewHeader from "./MonthViewHeader";
import DayListOfMonthView from "../../entity/DayListOfMonthView";
import {range} from "../../util/util";
import MonthViewRow from "./MonthViewRow";

export default function MonthView({dayListOfMonthView}: { dayListOfMonthView: DayListOfMonthView }) {

    let totalWeeks: number = dayListOfMonthView.totalWeeks;

    return <div className="month-view">
        <MonthViewHeader/>
        {
            range(0, totalWeeks).map((v, i, a) => {
                return <MonthViewRow dayListOfMonthView={dayListOfMonthView} weekIndex={v} key={v}/>
            })
        }
    </div>
}