import {useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectShowItem, updateShowItem} from "../../redux/showItemSlice";
import {DateTime} from "luxon";

function YearItem({date}: { date: DateTime }) {

    const [hidden, setHidden] = useState(true);
    const dispatch = useAppDispatch();

    const toLastYear = () => {
        const newDate = date.minus({years: 1});
        dispatch(updateShowItem(newDate));
    }

    const toNextYear = () => {
        const newDate = date.plus({years: 1});
        dispatch(updateShowItem(newDate));
    }

    return <div style={{display: "flex", alignItems: "center"}} onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}>
        <ChevronLeft className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                     onClick={toLastYear}/>
        <div>{date.year}年</div>
        <ChevronRight className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                      onClick={toNextYear}/>
    </div>
}

function MonthItem({date}: { date: DateTime }) {

    const [hidden, setHidden] = useState(true);
    const dispatch = useAppDispatch();

    const toLastMonth = () => {
        const newDate = date.minus({months: 1});
        dispatch(updateShowItem(newDate));
    }

    const toNextMonth = () => {
        const newDate = date.plus({months: 1});
        dispatch(updateShowItem(newDate));
    }

    return <div style={{display: "flex", alignItems: "center"}} onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}>
        <ChevronLeft className="d-hover-color-blue" style={{visibility: hidden ? 'hidden' : 'visible'}}
                     onClick={toLastMonth}/>
        <div>{date.month}月</div>
        <ChevronRight className="d-hover-color-blue" style={{visibility: hidden ? 'hidden' : 'visible'}}
                      onClick={toNextMonth}/>
        {/*<ChevronRight className="d-hover-color-blue" style={{visibility: hidden ? 'hidden' : 'visible'}} onClick={() => dispatch(updateShowItem(date.plus({months: 1})))}/>*/}
    </div>
}

function QuarterItem({date}: { date: DateTime }) {

    const [hidden, setHidden] = useState(true);
    const dispatch = useAppDispatch();

    const toLastQuarter = () => {
        const newDate = date.minus({months: 3});
        dispatch(updateShowItem(newDate));
    }

    const toNextQuarter = () => {
        const newDate = date.plus({months: 3});
        dispatch(updateShowItem(newDate));
    }

    return <div style={{display: "flex", alignItems: "center"}} onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}>
        <ChevronLeft className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                     onClick={toLastQuarter}/>
        <div>{date.quarter}季度</div>
        <ChevronRight className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                      onClick={toNextQuarter}/>
    </div>
}


export default function CalendarViewHeader() {

    let showItem = useAppSelector(selectShowItem);

    return <div style={{
        height: "40px",
        display: "flex",
        justifyContent: "space-between"
    }}>
        <div style={{
            fontSize: "22.5px",
            display: "flex",
            flexGrow: 1,
        }}>
            <YearItem date={showItem}/>
            <MonthItem date={showItem}/>
            <QuarterItem date={showItem}/>
        </div>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            flexBasis: "60px",
            alignItems: "center"
        }}>
            <div className="d-hover-bg-color-base-50"
                 style={{width: "20px", height: "20px", lineHeight: "20px", textAlign: "center", borderRadius: "50%"}}>今
            </div>
            <div className="d-hover-bg-color-base-50"
                 style={{width: "20px", height: "20px", lineHeight: "20px", textAlign: "center", borderRadius: "50%"}}>月
            </div>
        </div>
    </div>

}