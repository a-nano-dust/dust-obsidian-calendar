import React, {ChangeEvent, useState} from "react";
import DustCalendarPlugin from "../../main";


export default function TemplatePluginSelect({plugin}: { plugin: DustCalendarPlugin }) {

    const [templatePlugin, setTemplatePlugin] = useState(plugin.database.setting.templatePlugin);

    const onInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const ret = parseInt(e.target.value);
        setTemplatePlugin(ret);
        // plugin.database.setting.templatePlugin = ret;
        // plugin.templateController.templatePlugin = ret;
        plugin.templateController.updateTemplatePlugin(ret);
        plugin.mainSettingTab.display();
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                模板插件
            </div>
            <div className="setting-item-description">
                <div>将使用选中的模板插件填充初始的笔记内容。</div>
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