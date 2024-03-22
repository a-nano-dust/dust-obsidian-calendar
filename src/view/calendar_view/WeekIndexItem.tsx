import {useContext} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectSelectedItem, updateSelectedItem} from "../../redux/selectedItemSlice";
import {NoteType, SelectedItemType} from "../../base/enum";
import SelectedItem from "../../entity/SelectedItem";
import {DateTime} from "luxon";
import {MainControllerContext} from "../../base/context";

export default function WeekIndexItem({targetDay}: { targetDay: DateTime }) {
    let dispatch = useAppDispatch();
    let selectedItem = useAppSelector(selectSelectedItem);
    const mainController = useContext(MainControllerContext)!;

    let newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.WEEK_INDEX_ITEM;
    newSelectItem.date = targetDay;

    // 点击日期会更新已选中对象
    let onClickCallback = () => {
        dispatch(updateSelectedItem(newSelectItem));
    }

    let itemStyle = "calendar-view-item d-hover-bg-color-base-50";
    let itemBodyStyle = "month-view-item-body";
    if (selectedItem.type === SelectedItemType.WEEK_INDEX_ITEM && selectedItem.date.weekNumber === targetDay.weekNumber) {
        itemStyle = "calendar-view-item d-bg-color-blue";
        itemBodyStyle = "month-view-item-body month-view-item-body-selected";
    }

    // 有关联笔记的日期会使用一个点进行标注
    let dotStyle = "calendar-view-no-dot";
    if (mainController.hasNote(DateTime.local(targetDay.year, targetDay.month, targetDay.day), NoteType.WEEKLY)) {
        dotStyle = "calendar-view-dot";
    }

    return <div className={itemStyle} onClick={() => dispatch(updateSelectedItem(newSelectItem))}
                onDoubleClick={() => mainController.openFileBySelectedItem(newSelectItem)}>
        <div className={itemBodyStyle}>{targetDay.weekNumber}</div>
        <div className={dotStyle}/>
    </div>
}