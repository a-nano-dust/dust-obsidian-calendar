import React, {ChangeEvent, useState} from "react";
import DustCalendarPlugin from "../../main";


export default function QuarterNameModeSelect({plugin}: { plugin: DustCalendarPlugin }) {

    const [quarterNameMode, setQuarterNameMode] = useState(plugin.database.setting.quarterNameMode);

    const onInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const ret = parseInt(e.target.value);
        setQuarterNameMode(ret);
        plugin.database.setting.quarterNameMode = ret;
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                季度命名方式
            </div>
            <div className="setting-item-description">
                <div>这将影响日历头部季度区域和年视图中的季度名称。</div>
            </div>
        </div>
        <div className="setting-item-control">
            <select className="dropdown" onChange={onInputChange} value={quarterNameMode}>
                <option value={1}>数字</option>
                <option value={2}>春夏秋冬</option>
            </select>
        </div>
    </>
}