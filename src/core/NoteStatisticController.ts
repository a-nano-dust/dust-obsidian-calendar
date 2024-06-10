import {TAbstractFile, TFile} from "obsidian";
import {DateTime} from "luxon";
import DustCalendarPlugin from "../main";
import {NoteType} from "../base/enum";
import {countWords} from "../util/util";
import NoteStatistic from "../entity/NoteStatistic";


export default class NoteStatisticController {

    public readonly plugin: DustCalendarPlugin;
    private noteStatisticRegistry: Map<string, NoteStatistic>;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.noteStatisticRegistry = new Map();

        // 关联文件修改也删除事件，保证界面信息及时更新
        this.plugin.app.vault.on("modify", (file) => this.onFileModify(file));
        this.plugin.app.vault.on("delete", (file) => this.onFileDelete(file));
    }

    public getNoteStatic(date: DateTime, noteType: NoteType): NoteStatistic {
        const filename = this.plugin.noteController.getNoteFilename(date, noteType);
        if (filename === null) {
            return new NoteStatistic();
        }
        const noteStatistic = this.noteStatisticRegistry.get(filename);
        if (noteStatistic === undefined) {
            return new NoteStatistic();
        }
        return noteStatistic;
    }

    // 添加一个文件信息统计任务，由界面触发
    public addTaskByDateAndNoteType(date: DateTime, noteType: NoteType): void {
        setTimeout(async () => {
            await this.executeStaticByDateAndNoteType(date, noteType);
        }, 0);
    }

    // 添加一个文件信息统计任务，新建周期性笔记时触发，或者文件内容修改时触发
    public addTaskByFile(file: TAbstractFile | null): void {
        setTimeout(async () => {
            await this.executeStaticByFile(file);
        }, 0);
    }

    private async executeStaticByDateAndNoteType(date: DateTime, noteType: NoteType): Promise<void> {
        const filename = this.plugin.noteController.getNoteFilename(date, noteType);
        await this.executeStaticByFilename(filename);
    }

    private async executeStaticByFilename(filename: string | null): Promise<void> {
        if (filename === null) {
            return;
        }

        const {vault} = this.plugin.app;
        const file = vault.getAbstractFileByPath(filename);
        await this.executeStaticByFile(file);
    }

    // 文件信息统计
    private async executeStaticByFile(file: TAbstractFile | null): Promise<void> {
        if (file === null) {
            return;
        }

        if (!(file instanceof TFile)) {
            return;
        }

        const filename = file.path;
        const {vault} = this.plugin.app;
        const content = await vault.cachedRead(file as TFile);
        const totalWords = countWords(content);
        const newNoteStatistic = new NoteStatistic();
        newNoteStatistic.totalWords = totalWords;
        newNoteStatistic.totalDots = Math.ceil(totalWords / 200);

        const oldNoteStatistic = this.noteStatisticRegistry.get(filename);
        const isUpdated: boolean = oldNoteStatistic === undefined || !oldNoteStatistic.equals(newNoteStatistic);

        this.noteStatisticRegistry.set(filename, newNoteStatistic);

        // 判断信息有没有更新，如果有更新，就需要刷新界面
        if (isUpdated) {
            this.plugin.calendarViewFlushController.requestFlush();
        }
    }

    private onFileModify(file: TAbstractFile): void {
        this.addTaskByFile(file);
    }

    private onFileDelete(file: TAbstractFile): void {
        if (!(file instanceof TFile)) {
            return;
        }
        const filename = file.path;
        if (!this.noteStatisticRegistry.delete(filename)) {
            return;
        }
        // 如果成功从注册表中删除了文件，则需要刷新日历界面
        this.plugin.calendarViewFlushController.requestFlush();
    }
}