import React, {ChangeEvent, useState} from "react";
import MainController from "../core/MainController";


export default function FontSizeChangeModeSelect({mainController}: { mainController: MainController }) {

    const [fontSizeChangeMode, setFontSizeChangeMode] = useState(mainController.setting.fontSizeChangeMode);


    const onInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const ret = parseInt(e.target.value);
        setFontSizeChangeMode(ret);
        mainController.setting.fontSizeChangeMode = ret;
    };


    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                字体大小调整模式
            </div>
        </div>
        <div className="setting-item-control">
            <select className="dropdown" onChange={onInputChange} value={fontSizeChangeMode}>
                <option value={1}>跟随 Obsidian</option>
                <option value={2}>跟随侧边栏</option>
                <option value={3}>固定大小</option>
            </select>
        </div>
    </>
}