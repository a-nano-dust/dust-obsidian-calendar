import Path from "./Path";

import {TAbstractFile, Vault} from "obsidian"


export default class PathUtil {

    public static exists(path: Path, vault: Vault): boolean {
        return vault.getAbstractFileByPath(path.string) !== null;
    }

    public static async create(path: Path, vault: Vault): Promise<TAbstractFile> {
        // 根目录
        if (path.string.length === 0) {
            return vault.getRoot();
        }

        // 指定的路径存在，不需要创建
        const abstractFile = vault.getAbstractFileByPath(path.string);
        if (abstractFile !== null) {
            return abstractFile!;
        }

        // 递归，确保上级路径都存在
        await PathUtil.create(path.parent, vault);

        // 指定的路径文件夹，创建文件夹
        if (path.isFolder) {
            let targetFolder = await vault.createFolder(path.string);
            return targetFolder as TAbstractFile;
        }

        // 指定的路径是文件，
        let targetFile = await vault.create(path.string, "");
        return targetFile as TAbstractFile;
    }

}