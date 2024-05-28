import { createContext } from "react";
import { App } from "obsidian";
import MainController from "../core/MainController";
import Controller from "./Controller";

export const AppContext = createContext<App | undefined>(undefined);
export const ControllerContext = createContext<Controller | undefined>(undefined);
export const MainControllerContext = createContext<MainController | undefined>(
  undefined
);
