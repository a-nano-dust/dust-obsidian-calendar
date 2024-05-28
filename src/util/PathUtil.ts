import Path from "./Path";

import {TAbstractFile, Vault} from "obsidian"


export default class PathUtil {

    public static exists(path: Path, vault: Vault): boolean {
        return vault.getAbstractFileByPath(path.string) != null;
    }

    public static async create(path: Path, vault: Vault): Promise<TAbstractFile> {

        // 根目录
        if (path.string.length === 0) {
            return vault.getRoot();
            // return new Promise<TAbstractFile>(resolve => resolve(vault.getRoot()));
        }

        // 指定的路径存在，不需要创建
        const abstractFile = vault.getAbstractFileByPath(path.string);
        if (abstractFile !== null) {
            return abstractFile!;
        }

        // 递归，确保上级路径都存在
        await PathUtil.create(path.parent, vault);
        // let parentFolder: TAbstractFile = await PathUtil.create(path.parent, vault);

        // 指定的路径文件夹，创建文件夹
        if (path.isFolder) {
            let targetFolder = await vault.createFolder(path.string);
            return targetFolder as TAbstractFile;
            // return vault.createFolder(path.string);
        }

        // 指定的路径是文件，
        let targetFile = await vault.create(path.string, "");
        return targetFile as TAbstractFile;


        // return new Promise<TAbstractFile>(resolve => {
        //     PathUtil.create(path.parent, vault).then(folder => {
        //         vault.create(path.string, "").then(file => {
        //             resolve(file);
        //         });
        //     });
        // });
    }

    // public static create(path: Path, vault: Vault): Promise<TAbstractFile> {
    //
    //     if (path.string.length === 0) {
    //         return new Promise<TAbstractFile>(resolve => resolve(vault.getRoot()));
    //     }
    //
    //     const abstractFile = vault.getAbstractFileByPath(path.string);
    //     if (abstractFile !== null) {
    //         return new Promise<TAbstractFile>(resolve => resolve(abstractFile!));
    //     }
    //
    //     if (path.isFolder) {
    //         return vault.createFolder(path.string);
    //     }
    //
    //     return new Promise<TAbstractFile>(resolve => {
    //         PathUtil.create(path.parent, vault).then(folder => {
    //             vault.create(path.string, "").then(file => {
    //                 resolve(file);
    //             });
    //         });
    //     });
    // }
}