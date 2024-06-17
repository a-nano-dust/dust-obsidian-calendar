import React, {ChangeEvent, useState} from "react";
import DustCalendarPlugin from "../../main";
import {NoteType} from "../../base/enum";

export default function NoteTemplate({plugin, noteType}: { plugin: DustCalendarPlugin, noteType: NoteType }) {


    const [templateFilename, setTemplateFilename] = useState(plugin.templateController.getTemplateFilename(noteType)!);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTemplateFilename(e.target.value);
        plugin.templateController.setTemplateFilename(noteType, e.target.value);
    };

    const hasTemplateFolder = plugin.templateController.hasTemplateFolder();
    const hasTemplateFile = hasTemplateFolder ? (templateFilename.length === 0 ? true : plugin.templateController.hasTemplateFile(templateFilename)) : true;

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                模板文件
            </div>
            <div className="setting-item-description">
                {hasTemplateFolder
                    ?
                    <div>请指定一个模板文件的名称，模板文件位于 <b
                        className="d-setting-accent">{plugin.templateController.getTemplateFolder().string}</b> 路径下。
                    </div>
                    : <div className="d-setting-error">未检测到模板文件夹或模板文件夹不存在，请先配置模板文件夹。</div>
                }
                {!hasTemplateFile &&
                    <div className="d-setting-error">注意：<b>{templateFilename}</b> 不是模板文件！！！</div>}
            </div>
        </div>
        <div className="setting-item-control">
            <input type="text" value={templateFilename} spellCheck="false" onChange={onInputChange}/>
        </div>
    </>
}