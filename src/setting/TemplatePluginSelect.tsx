import React, {ChangeEvent, useState} from "react";
import MainController from "../core/MainController";
import MainSettingTable from "./MainSettingTable";


export default function TemplatePluginSelect({
                                                 mainController,
                                                 mainSettingTable
                                             }: { mainController: MainController, mainSettingTable: MainSettingTable }) {

    const [templatePlugin, setTemplatePlugin] = useState(mainController.setting.templatePlugin);


    const onInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const ret = parseInt(e.target.value);
        setTemplatePlugin(ret);
        mainController.setting.templatePlugin = ret;
        mainController.templateController.templatePlugin = ret;
        mainSettingTable.display();
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                模板插件
            </div>
            <div className="setting-item-description">
                <div>将使用选中的模板插件填充初始的笔记内容</div>
            </div>
        </div>
        <div className="setting-item-control">
            <select className="dropdown" onChange={onInputChange} value={templatePlugin}>
                <option value={0}>不使用模板</option>
                <option value={1}>Obsidian 模板</option>
                <option value={2}>Templater</option>
            </select>
        </div>
    </>
}