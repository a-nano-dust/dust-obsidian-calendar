import React, {ChangeEvent, useState} from "react";
import MainController from "../core/MainController";


export default function ImmutableFontSizeSlider({mainController}: { mainController: MainController }) {

    const [immutableFontSizeFactor, setImmutableFontSizeFactor] = useState<number>(mainController.setting.immutableFontSizeFactor);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const ret = parseInt(e.target.value);
        setImmutableFontSizeFactor(ret);
        mainController.setting.immutableFontSizeFactor = ret;
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                字体大小
            </div>
        </div>
        <div className="setting-item-control">
            <input className="slider" type="range" min="0" max="20" step="1" onChange={onInputChange}
                   value={immutableFontSizeFactor}/>
        </div>
    </>
}