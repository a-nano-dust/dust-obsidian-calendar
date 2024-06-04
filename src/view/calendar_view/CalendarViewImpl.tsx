import {useContext, useEffect, useRef, useState} from "react";
import DayListOfMonthView from "../../entity/DayListOfMonthView";
import MonthView from "./MonthView";
import {useAppSelector} from "../redux/hooks";
import CalendarViewHeader from "./CalendarViewHeader";
import YearView from "./YearView";
import {selectCalendarViewType} from "../redux/calendarViewType";
import {CalendarViewType, FontSizeChangeMode} from "../../base/enum"
import {selectSelectedItem} from "../redux/selectedItemSlice";
import {PluginContext} from "../context";

export default function CalendarViewImpl() {
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedDate = selectedItem.date;
    const calendarViewType = useAppSelector(selectCalendarViewType);
    const plugin = useContext(PluginContext)!;

    const widthRef = useRef(null);
    const [width, setWidth] = useState(168);
    useEffect(() => {
        const element = widthRef.current;
        if (!element) return;

        // 创建 ResizeObserver 实例
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.target === element) {
                    const contentRect = entry.contentRect;
                    setWidth(contentRect.width);
                }
            }
        });

        // 开始监听
        resizeObserver.observe(element);

        // 清理函数，在组件卸载时停止监听
        return () => {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
        };
    });

    const fontSizeChangeMode = plugin.database.setting.fontSizeChangeMode;
    let fontSizeFactor = plugin.database.setting.immutableFontSizeFactor / 10;

    let fontSizeCustomEnable = 1;
    let fontSizeFollowObsidian = 0;
    if (fontSizeChangeMode === FontSizeChangeMode.FOLLOW_OBSIDIAN) {
        fontSizeCustomEnable = 0;
        fontSizeFollowObsidian = 1;
    }
    else if (fontSizeChangeMode === FontSizeChangeMode.FOLLOW_WIDGET) {
        let tmp = width - 168;
        if (tmp > 200) {
            tmp = 200;
        }
        fontSizeFactor = tmp / 100;
    }

    const style = {
        '--d-font-size-factor': fontSizeFactor,
        '--d-font-size-custom-enable': fontSizeCustomEnable,
        '--d-font-size-follow-obsidian': fontSizeFollowObsidian
    };

    if (calendarViewType === CalendarViewType.MONTH) {
        const dayListOfMonthView: DayListOfMonthView = new DayListOfMonthView(selectedDate.year, selectedDate.month);
        return <div style={style as React.CSSProperties} ref={widthRef}>
            <CalendarViewHeader/>
            <MonthView dayListOfMonthView={dayListOfMonthView}/>
        </div>
    }
    else {
        return <div style={style as React.CSSProperties} ref={widthRef}>
            <CalendarViewHeader/>
            <YearView showYear={selectedDate.year}/>
        </div>
    }


}