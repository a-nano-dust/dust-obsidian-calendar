import React, {ChangeEvent, useState} from "react";
import {DateTime} from "luxon";
import MainController from "../core/MainController";


export default function WeeklyNotePattern({mainController}: { mainController: MainController }) {

    const [pattern, setPattern] = useState(mainController.setting.weeklyNotePattern);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPattern(e.target.value);
        mainController.setting.weeklyNotePattern = e.target.value;
    };

    const text = DateTime.now().toFormat(pattern);

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                文件命名规则
            </div>
            <div className="setting-item-description">
                <div>请使用&nbsp;<a
                    href="https://moment.github.io/luxon/#/formatting?id=table-of-tokens">luxon语法</a>&nbsp;指定笔记文件的生成路径
                </div>
                <div>规则应用后的文件路径为（基于当前日期）：{text}</div>
            </div>
        </div>
        <div className="setting-item-control">
            <input type="text" value={pattern} spellCheck="false" onChange={onInputChange} placeholder="周记/yyyy-WW"/>
        </div>
    </>
}