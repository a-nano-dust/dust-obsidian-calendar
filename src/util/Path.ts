import {App, TAbstractFile} from "obsidian";


export default class Path {

    private _app: App;
    private _path: string;
    private _parent: string | null;
    private _filename: string | null;
    private _extension: string | null;
    private _exists: boolean | null;
    private _abstractFile : TAbstractFile | null;

    constructor(app: App, path: string) {
        this._app = app;
        this._path = path;

        this._parent = null;
        this._filename = null;
        this._extension = null;

        this._exists = null;

        this._abstractFile = null;

        this.normalize();
    }

    get app(): App {
        return this._app;
    }

    get string(): string {
        return this._path;
    }

    get parent(): Path {
        this.parseFilename();
        return new Path(this._app, this._parent!);
    }

    get filename(): Path {
        this.parseFilename();
        return new Path(this._app, this._filename!);
    }

    get pureFilename(): Path {
        this.parseFilename();
        this.parseExtension();
        let pattern: RegExp = new RegExp("".concat(this._extension!, "$"));
        let newPath = this._filename!.replace(pattern, "");
        return new Path(this._app, newPath);
    }

    get extension(): Path {
        this.parseExtension();
        return new Path(this._app, this._extension!);
    }

    get isFolder(): boolean {
        this.parseExtension();
        return this.extension.string.length == 0;
    }

    get isFile(): boolean {
        return !this.isFolder;
    }

    public append(path: Path): Path {
        if (path.string.startsWith("/")) {
            return new Path(this._app, this.string.concat(path.string));
        }
        return new Path(this._app, this.string.concat("/", path.string));
    }

    public exists(): boolean {
        this.parseAbstractFile();
        return this._exists!;
    }

    public createIfNotExist(): Promise<TAbstractFile> {
        this.parseAbstractFile();
        if (this._exists) {
            return new Promise<TAbstractFile>(resolve => resolve(this._abstractFile!));
        }
        if (this.isFolder) {
            return this._app.vault.createFolder(this._path);
        }
        else {
            return this._app.vault.create(this._path, "");
        }
    }

    private normalize(): void {
        // 删除开头的 ./
        this._path = this._path.replace(/^\.\//,"");
        // 删除结尾的 /
        this._path = this._path.replace(/\/$/, "");
        // 解析 . 和 .. 为更简洁的形式
        this._path = this._path.replace(/\/\.\//, "/");
        this._path = this._path.replace(/\/.*\/\.\.\//, "/");
        this._path = this._path.replace(/^.*\/\.\.\//, "/");
    }

    private parseFilename(): void {
        if (this._filename !== null) {
            return;
        }
        let index = this._path.lastIndexOf("/");

        if (index == -1) {
            this._filename = "";
            this._parent = "";
        }
        this._filename = this._path.substring(index + 1);
        this._parent = this._path.substring(0, index);
    }

    private parseExtension(): void {
        if (this._extension !== null) {
            return;
        }
        let index = this._path.lastIndexOf(".");
        if (index === -1) {
            this._extension = "";
        }
        this._extension = this._path.substring(index);
    }

    private parseAbstractFile(): void {
        if (this._exists !== null) {
            return;
        }
        this._abstractFile = this._app.vault.getAbstractFileByPath(this._path);
        this._exists = this._abstractFile !== null;
    }
}