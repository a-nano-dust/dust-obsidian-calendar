import {FontSizeChangeMode, QuarterNameMode, TemplatePlugin, TodoAnnotationMode} from "../base/enum";

export default class PluginSetting {

    shouldDisplayLunarInfo: boolean;                        // 是否显示农历信息
    shouldDisplayHolidayInfo: boolean;                      // 是否显示调休信息

    fontSizeChangeMode: FontSizeChangeMode;                 // 字体大小调整方式
    immutableFontSizeFactor: number;                        // 固定字体的大小

    quarterNameMode: QuarterNameMode;                       // 季度命名方式

    wordsPerDot: number;                                    // 多少字一个点
    dotUpperLimit: number;                                  // 最多几个点
    todoAnnotationMode: TodoAnnotationMode;                 // 待办呈现方式：不展示、颜色标注、圆孔标注

    templatePlugin: TemplatePlugin;                         // 模板插件

    dailyNoteOption: boolean;                               // 每日笔记开关
    dailyNotePattern: string;                               // 每日笔记文件命名规则
    dailyTemplateFilename: string;                          // 每日笔记模板文件名称

    weeklyNoteOption: boolean;                              // 每周笔记开关
    weeklyNotePattern: string;                              // 每周笔记文件命名规则
    weeklyTemplateFilename: string;                         // 每周笔记模板文件名称

    monthlyNoteOption: boolean;                             // 每月笔记开关
    monthlyNotePattern: string;                             // 每月笔记文件命名规则
    monthlyTemplateFilename: string;                        // 每月笔记模板文件名称

    quarterlyNoteOption: boolean;                           // 季度笔记开关
    quarterlyNotePattern: string;                           // 季度笔记文件命名规则
    quarterlyTemplateFilename: string;                      // 季度笔记模板文件名称

    yearlyNoteOption: boolean;                              // 年度笔记开关
    yearlyNotePattern: string;                              // 年度笔记文件命名规则
    yearlyTemplateFilename: string;                         // 年度笔记模板文件名称

    constructor() {

        this.shouldDisplayLunarInfo = true;
        this.shouldDisplayHolidayInfo = true;

        this.fontSizeChangeMode = FontSizeChangeMode.IMMUTABLE;
        this.immutableFontSizeFactor = 1;

        this.quarterNameMode = QuarterNameMode.NUMBER;

        this.wordsPerDot = 200;
        this.dotUpperLimit = 3;
        this.todoAnnotationMode = TodoAnnotationMode.HOLE;

        this.templatePlugin = TemplatePlugin.NONE;

        this.dailyNoteOption = false;
        this.dailyNotePattern = "";
        this.dailyTemplateFilename = "";

        this.weeklyNoteOption = false;
        this.weeklyNotePattern = "";
        this.weeklyTemplateFilename = "";

        this.monthlyNoteOption = false;
        this.monthlyNotePattern = "";
        this.monthlyTemplateFilename = "";

        this.quarterlyNoteOption = false;
        this.quarterlyNotePattern = "";
        this.quarterlyTemplateFilename = "";

        this.yearlyNoteOption = false;
        this.yearlyNotePattern = "";
        this.yearlyTemplateFilename = "";
    }

}
