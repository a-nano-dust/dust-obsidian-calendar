import React, {ChangeEvent, useState} from "react";
import DustCalendarPlugin from "../../main";


export default function DotUpperLimitSelect({plugin}: { plugin: DustCalendarPlugin }) {

    const [dotUpperLimit, setDotUpperLimit] = useState(plugin.noteStatisticController.getDotUpperLimit());

    const onInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const ret = parseInt(e.target.value);
        setDotUpperLimit(ret);
        plugin.noteStatisticController.setDotUpperLimit(ret);
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                字数统计：点数上限
            </div>
            <div className="setting-item-description">
                <div>日历界面中允许为一条笔记显示的点数上限。</div>
            </div>
        </div>
        <div className="setting-item-control">
            <select className="dropdown" onChange={onInputChange} value={dotUpperLimit}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
            </select>
        </div>
    </>
}