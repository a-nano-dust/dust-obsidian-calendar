export default class NoteStatistic {
    public totalWords: number | null;
    public totalDots: number | null;
    public hasUnfinishedTasks: boolean | null;

    constructor() {
        this.totalWords = null;
        this.totalDots = null;
        this.hasUnfinishedTasks = null;
    }

    public equals(another: NoteStatistic): boolean {
        if (this.totalWords !== another.totalWords) {
            return false;
        }
        if (this.totalDots !== another.totalDots) {
            return false;
        }
        if (this.hasUnfinishedTasks !== another.hasUnfinishedTasks) {
            return false;
        }

        return true;
    }
}