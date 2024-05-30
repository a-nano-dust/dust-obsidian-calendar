import { NoteKey } from "./enum";

export interface INoteConfig {
  open: boolean;
  format: string;
  folder: string;
  template?: string;
}

export interface IPluginSetting {
  [NoteKey.DAILY]: INoteConfig;
  [NoteKey.WEEKLY]: INoteConfig;
  [NoteKey.MONTHLY]: INoteConfig;
  [NoteKey.QUARTERLY]: INoteConfig;
  [NoteKey.YEARLY]: INoteConfig;
}
