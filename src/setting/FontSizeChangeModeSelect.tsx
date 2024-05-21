import React, {ChangeEvent, useState} from "react";
import MainController from "../core/MainController";
import MainSettingTable from "./MainSettingTable";


export default function FontSizeChangeModeSelect({
                                                     mainController,
                                                     mainSettingTable
                                                 }: { mainController: MainController, mainSettingTable: MainSettingTable }) {

    const [fontSizeChangeMode, setFontSizeChangeMode] = useState(mainController.setting.fontSizeChangeMode);


    const onInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const ret = parseInt(e.target.value);
        setFontSizeChangeMode(ret);
        mainController.setting.fontSizeChangeMode = ret;
        mainSettingTable.display();
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                字体大小调整模式
            </div>
            <div className="setting-item-description">
                <div>日历界面的字体大小可以自动或手动调整，可根据习惯选择一个模式。</div>
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