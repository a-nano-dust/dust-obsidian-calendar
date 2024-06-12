import {useContext} from "react";
import {DateTime} from "luxon";
import {range} from "../../util/util";
import {NoteType, TodoAnnotationMode} from "../../base/enum";
import {PluginContext} from "../context";


export default function StatisticLabel({date, noteType}: { date: DateTime, noteType: NoteType }) {

    const plugin = useContext(PluginContext)!;

    const {totalDots, hasUnfinishedTasks} = plugin.noteStatisticController.getNoteStatic(date, noteType);
    const todoAnnotationMode = plugin.noteStatisticController.getTodoAnnotationMode();
    let dotStyle = "statistic-label-dot";
    // 是否在日历界面上为圆点添加颜色以标注待办
    if (todoAnnotationMode === TodoAnnotationMode.COLOR && hasUnfinishedTasks !== null && hasUnfinishedTasks) {
        dotStyle = dotStyle.concat(" statistic-label-dot-with-todo");
    }
    // 是否在日历界面上显示圆孔以标注待办
    const displayHole: boolean = todoAnnotationMode == TodoAnnotationMode.HOLE && hasUnfinishedTasks !== null && hasUnfinishedTasks;
    // 更新笔记统计信息
    plugin.noteStatisticController.addTaskByDateAndNoteType(date, noteType);

    return <div className="statistic-label">
        {
            totalDots !== null && totalDots !== 0
                ? range(0, totalDots).map((v) => {
                    return <svg className={dotStyle} viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg" key={v}>
                        <circle cx="3" cy="3" r="2"/>
                    </svg>
                })
                : <></>
        }
        {
            displayHole
                ? <svg className="statistic-label-hole" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="3" r="2"/>
                </svg>
                : <></>
        }
    </div>
}
