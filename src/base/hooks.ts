import { useContext } from "react";
import { AppContext, ControllerContext } from "./context";
import { App } from "obsidian";
import Controller from "./Controller";

export const useApp = (): App | undefined => {
  return useContext(AppContext);
};

export const useMain = (): Controller | undefined => {
  return useContext(ControllerContext);
};
