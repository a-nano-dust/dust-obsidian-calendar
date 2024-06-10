import {useContext} from "react";
import {DateTime} from "luxon";
import {range} from "../../util/util";
import {NoteType} from "../../base/enum";
import {PluginContext} from "../context";


export default function StatisticLabel({date, noteType}: { date: DateTime, noteType: NoteType }) {

    const plugin = useContext(PluginContext)!;

    // 处理统计信息
    const noteStatistic = plugin.noteStatisticController.getNoteStatic(date, noteType);
    plugin.noteStatisticController.addTaskByDateAndNoteType(date, noteType);

    const {totalDots, hasUnfinishedTasks} = noteStatistic;

    return <div className="statistic-label">
        {
            totalDots !== null && totalDots !== 0
                ? range(0, totalDots).map((v) => {
                    return <svg className="statistic-label-dot" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3" cy="3" r="2"/>
                    </svg>
                })
                : <></>
        }
        {
            hasUnfinishedTasks !== null && hasUnfinishedTasks
                ? <svg className="statistic-label-hollow" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="3" r="2"/>
                </svg>
                : <></>
        }
    </div>
}
