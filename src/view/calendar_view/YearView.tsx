import {useContext} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectSelectedItem, updateSelectedItem} from "../../redux/selectedItemSlice";
import {MainControllerContext} from "../../base/context";
import {NoteType, SelectedItemType} from "../../base/enum";
import {DateTime} from "luxon";
import SelectedItem from "../../entity/SelectedItem";


function MonthItem({showYear, showMonth}: { showYear: number, showMonth: number }) {

    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const mainController = useContext(MainControllerContext)!;

    // 每个月份都可能被选中，提前创建对象以便更新
    const newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.MONTH_ITEM;
    newSelectItem.date = DateTime.local(showYear, showMonth);

    // 被选中和未被选中月份的背景颜色不同
    let bodyStyle = "d-normal-font d-hover-bg-color-base-50";
    // let bodyStyle = "calendar-view-item d-hover-bg-color-base-50";
    if (selectedItem.type === SelectedItemType.MONTH_ITEM && selectedItem.date.year === showYear && selectedItem.date.month === showMonth) {
        bodyStyle = "d-normal-font d-bg-color-blue";
        // bodyStyle = "calendar-view-item d-bg-color-blue";
    }


    // 有关联笔记的日期会使用一个点进行标注
    let dotStyle = "calendar-view-no-dot";
    if (mainController.hasNote(DateTime.local(showYear, showMonth), NoteType.MONTHLY)) {
        dotStyle = "calendar-view-dot";
    }

    return <div className={bodyStyle} onClick={() => dispatch(updateSelectedItem(newSelectItem))}
                onDoubleClick={() => mainController.openFileBySelectedItem(newSelectItem)}>
        <div>{showMonth}月</div>
        <div className={dotStyle}/>
    </div>
}

function QuarterItem({showYear, showQuarter}: { showYear: number, showQuarter: number }) {

    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const mainController = useContext(MainControllerContext)!;

    // 每个月份都可能被选中，提前创建对象以便更新
    const newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.QUARTER_ITEM;
    newSelectItem.date = DateTime.local(showYear, showQuarter * 3 - 2);

    // 被选中和未被选中月份的背景颜色不同
    let bodyStyle = "d-normal-font d-hover-bg-color-base-50";
    // let bodyStyle = "calendar-view-item d-hover-bg-color-base-50";
    if (selectedItem.type === SelectedItemType.QUARTER_ITEM && selectedItem.date.year === showYear && selectedItem.date.quarter === showQuarter) {
        bodyStyle = "d-normal-font d-bg-color-blue";
        // bodyStyle = "calendar-view-item d-bg-color-blue";
    }

    // 有关联笔记的日期会使用一个点进行标注
    let dotStyle = "calendar-view-no-dot";
    if (mainController.hasNote(DateTime.local(showYear, showQuarter * 3 - 2), NoteType.QUARTERLY)) {
        dotStyle = "calendar-view-dot";
    }

    return <div className={bodyStyle} onClick={() => dispatch(updateSelectedItem(newSelectItem))}
                onDoubleClick={() => mainController.openFileBySelectedItem(newSelectItem)}>
        <div>{showQuarter}季度</div>
        <div className={dotStyle}/>
    </div>
}

function YearViewRow({showYear, showQuarter}: { showYear: number, showQuarter: number }) {
    return <div className="calendar-view-row">
        <QuarterItem showYear={showYear} showQuarter={showQuarter}/>
        <MonthItem showYear={showYear} showMonth={showQuarter * 3 - 2}/>
        <MonthItem showYear={showYear} showMonth={showQuarter * 3 - 1}/>
        <MonthItem showYear={showYear} showMonth={showQuarter * 3}/>
    </div>
}

export default function YearView({showYear}: { showYear: number }) {
    return <div className="calendar-view-body">
        <YearViewRow showYear={showYear} showQuarter={1}/>
        <YearViewRow showYear={showYear} showQuarter={2}/>
        <YearViewRow showYear={showYear} showQuarter={3}/>
        <YearViewRow showYear={showYear} showQuarter={4}/>
    </div>
}
