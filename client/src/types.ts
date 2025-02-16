export type Nullable<T> = T | null;

export type CharacterId =
  | "CLOUD"
  | "TIFA"
  | "BARRET"
  | "AERITH"
  | "SEPHIROTH"
  | "RENO"
  | "RUDE"
  | "TSENG"
  | "HOJO"
  | "PRESIDENT_SHINRA"
  | "BIGGS"
  | "MARLENE"
  | "JESSIE"
  | "WEDGE"
  | "ZACK"
  | "BETTY"
  | "BECK"
  | "ELMYRA"
  | "SAM"
  | "SCOTCH"
  | "REEVE"
  | "ANDREA"
  | "MADAME_M"
  | "DON_CORNEO"
  | "UNKNOWN";

export type CharacterInfo = {
  id: string;
  name: string;
};

export type Character = {
  id: CharacterId;
  names: string[];
};

export type Dialogue = {
  id: string;
  character: CharacterInfo;
  text: string;
};

export type Subchapter = {
  id: string;
  title: string;
  dialogues: Dialogue[];
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  subchapters: Subchapter[];
};

export type ScriptData = {
  chapters: Chapter[];
  characters: Record<CharacterId, Character>;
};
