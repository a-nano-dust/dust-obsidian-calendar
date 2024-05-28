import { NoteKey } from "./enum";

interface noteConfig {
  open: boolean;
  format: string;
  folder: string;
  template?: string;
}

export interface IPluginSetting {
  [NoteKey.DAILY]: noteConfig;
  [NoteKey.WEEKLY]: noteConfig;
  [NoteKey.MONTHLY]: noteConfig;
  [NoteKey.QUARTERLY]: noteConfig;
  [NoteKey.YEARLY]: noteConfig;
}
