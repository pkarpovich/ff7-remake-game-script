export type Nullable<T> = T | null;

export type Dialogue = {
  character: string;
  text: string;
};

export type Subchapter = {
  title: string;
  dialogues: Dialogue[];
};

export type Chapter = {
  number: number;
  title: string;
  subchapters: Subchapter[];
};

export type ScriptData = {
  chapters: Chapter[];
};
