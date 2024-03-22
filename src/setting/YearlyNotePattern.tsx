import React, {ChangeEvent, useState} from "react";
import {DateTime} from "luxon";
import MainController from "../core/MainController";


export default function YearlyNotePattern({mainController}: { mainController: MainController }) {

    const [pattern, setPattern] = useState(mainController.setting.yearlyNotePattern);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPattern(e.target.value);
        mainController.setting.yearlyNotePattern = e.target.value;
    };

    const text = DateTime.now().toFormat(pattern);

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                文件名样式
            </div>
            <div className="setting-item-description">
                <div><a href="https://moment.github.io/luxon/#/formatting?id=table-of-tokens">语法说明</a></div>
                <div>今天：{text}</div>
            </div>
        </div>
        <div className="setting-item-control">
            <input type="text" value={pattern} spellCheck="false" onChange={onInputChange}/>
        </div>
    </>
}