import React, {ChangeEvent, useState} from "react";
import DustCalendarPlugin from "../../main";


export default function WordsPerDotInput({plugin}: { plugin: DustCalendarPlugin }) {

    const [wordsPerDot, setWordsPerDot] = useState<number | string>(plugin.noteStatisticController.getWordsPerDot());

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {

        // 纯数字校验，允许为空
        const text = e.target.value;
        if (text.length !== 0 && text.match(/^[1-9][0-9]{0,9}$/) === null) {
            return;
        }

        setWordsPerDot(text);

        if (text.length !== 0) {
            const ret = parseInt(e.target.value);
            plugin.noteStatisticController.setWordsPerDot(ret);
        }
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                字数统计：字/点
            </div>
            <div className="setting-item-description">
                <div>日历界面上的一个点代表笔记中多少个字（或词）。</div>
            </div>
        </div>
        <div className="setting-item-control">
            <input type="number" value={wordsPerDot} onChange={onInputChange}/>
        </div>
    </>
}