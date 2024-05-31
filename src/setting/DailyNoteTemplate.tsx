import React, {ChangeEvent, useState} from "react";
import MainController from "../core/MainController";
import Path from "../util/Path";


export default function DailyNoteTemplate({mainController}: { mainController: MainController }) {

    const [dailyTemplateFilename, setDailyTemplateFilename] = useState(mainController.setting.dailyTemplateFilename);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDailyTemplateFilename(e.target.value);
        mainController.setting.dailyTemplateFilename = e.target.value;
    };

    const templateFolder: Path | null = mainController.templateController.templateFolder;

    let isExistTemplateFile = true
    if (templateFolder !== null && dailyTemplateFilename.length !== 0) {
        isExistTemplateFile = mainController.templateController.isTemplateFile(new Path(dailyTemplateFilename));
    }

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                模板文件
            </div>
            <div className="setting-item-description">
                {templateFolder === null
                    ? <div className="d-color-error">未检测到模板文件夹或模板文件夹不存在，请先配置模板文件夹</div>
                    : <div>指定一个模板文件的名称。模板文件位于 <b>{templateFolder!.string}</b> 路径下</div>
                }

                {/*<div>规则应用后的文件路径为（基于当前日期）：{text}</div>*/}
                {!isExistTemplateFile && <div className="d-color-error">{dailyTemplateFilename} 不是模板文件！！！</div>}
            </div>
        </div>
        <div className="setting-item-control">
            <input type="text" value={dailyTemplateFilename} spellCheck="false" onChange={onInputChange}/>
        </div>
    </>
}