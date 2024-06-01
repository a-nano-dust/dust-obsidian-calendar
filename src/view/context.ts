import {createContext} from "react";
import DustCalendarPlugin from "../main";

export const PluginContext = createContext<DustCalendarPlugin | undefined>(undefined);
