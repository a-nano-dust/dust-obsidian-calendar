import Path from "./Path";

import {TAbstractFile, Vault} from "obsidian"


export default class PathUtil {

    public static exists(path: Path, vault: Vault): boolean {
        return vault.getAbstractFileByPath(path.string) != null;
    }

    public static create(path: Path, vault: Vault): Promise<TAbstractFile> {

        if (path.string.length === 0) {
            return new Promise<TAbstractFile>(resolve => resolve(vault.getRoot()));
        }

        const abstractFile = vault.getAbstractFileByPath(path.string);
        if (abstractFile !== null) {
            return new Promise<TAbstractFile>(resolve => resolve(abstractFile!));
        }

        if (path.isFolder) {
            return vault.createFolder(path.string);
        }

        return new Promise<TAbstractFile>(resolve => {
            PathUtil.create(path.parent, vault).then(folder => {
                vault.create(path.string, "").then(file => {
                    resolve(file);
                });
            });
        });
    }
}