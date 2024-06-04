import React, {ChangeEvent, useState} from "react";
import DustCalendarPlugin from "../../main";


export default function ImmutableFontSizeSlider({plugin}: { plugin: DustCalendarPlugin }) {

    const [immutableFontSizeFactor, setImmutableFontSizeFactor] = useState<number>(plugin.viewController.getImmutableFontSizeFactor());

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const ret = parseInt(e.target.value);
        setImmutableFontSizeFactor(ret);
        plugin.viewController.setImmutableFontSizeFactor(ret);
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