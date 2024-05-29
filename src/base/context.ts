import {createContext} from "react";
import MainController from "../core/MainController";

export const MainControllerContext = createContext<MainController | undefined>(undefined);
