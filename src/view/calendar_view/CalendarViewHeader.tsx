import {useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useAppSelector} from "../../redux/hooks";
import {selectShowItem} from "../../redux/showItemSlice";

function YearItem({year}: { year: number }) {

    const [hidden, setHidden] = useState(true);

    return <div style={{display: "flex", alignItems: "center"}} onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}>
        <ChevronLeft className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}/>
        <div>{year}年</div>
        <ChevronRight className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}/>
    </div>
}

function MonthItem({month}: { month: number }) {

    const [hidden, setHidden] = useState(true);

    return <div style={{display: "flex", alignItems: "center"}} onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}>
        <ChevronLeft className="d-hover-color-blue" style={{visibility: hidden ? 'hidden' : 'visible'}}/>
        <div>{month}月</div>
        <ChevronRight className="d-hover-color-blue" style={{visibility: hidden ? 'hidden' : 'visible'}}/>
    </div>
}

function QuarterItem({quarter}: { quarter: number }) {

    const [hidden, setHidden] = useState(true);

    return <div style={{display: "flex", alignItems: "center"}} onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}>
        <ChevronLeft className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}/>
        <div>{quarter}季度</div>
        <ChevronRight className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}/>
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
            <YearItem year={showItem.year}/>
            <MonthItem month={showItem.month}/>
            <QuarterItem quarter={showItem.quarter}/>
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