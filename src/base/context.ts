import {createContext} from "react";
import {App} from "obsidian";
import MainController from "../core/MainController";

export const AppContext = createContext<App | undefined>(undefined);
export const MainControllerContext = createContext<MainController | undefined>(undefined);
