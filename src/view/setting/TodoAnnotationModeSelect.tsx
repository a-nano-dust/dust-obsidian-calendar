import React, {ChangeEvent, useState} from "react";
import DustCalendarPlugin from "../../main";


export default function TodoAnnotationModeSelect({plugin}: { plugin: DustCalendarPlugin }) {

    const [todoAnnotationMode, setTodoAnnotationMode] = useState(plugin.noteStatisticController.getTodoAnnotationMode());

    const onInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const ret = parseInt(e.target.value);
        setTodoAnnotationMode(ret);
        plugin.noteStatisticController.setTodoAnnotationMode(ret);
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                待办标注方式
            </div>
            <div className="setting-item-description">
                <div>统计笔记中的待办事项，并标注在日历界面上。</div>
            </div>
        </div>
        <div className="setting-item-control">
            <select className="dropdown" onChange={onInputChange} value={todoAnnotationMode}>
                <option value={1}>不标注</option>
                <option value={2}>颜色标注</option>
                <option value={3}>圆孔标注</option>
            </select>
        </div>
    </>
}