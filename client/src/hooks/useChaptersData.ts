import { useState, useEffect, useCallback } from "react";
import type { Chapter, Subchapter, Nullable } from "../types";
import data from "../data/ffvii_remake_script.json";

export function useChaptersData() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] =
    useState<Nullable<Chapter>>(null);
  const [selectedSubchapter, setSelectedSubchapter] =
    useState<Nullable<Subchapter>>(null);

  useEffect(() => {
    setChapters(data.chapters);
    if (data.chapters.length > 0) {
      setSelectedChapter(data.chapters[0]);
      setSelectedSubchapter(data.chapters[0].subchapters[0]);
    }
  }, []);

  const handleSetSubchapter = useCallback(
    (chapter: Chapter, subchapter: Subchapter) => {
      setSelectedChapter(chapter);
      setSelectedSubchapter(subchapter);
    },
    [],
  );

  return {
    chapters,
    selectedChapter,
    selectedSubchapter,
    setSelectedSubchapter: handleSetSubchapter,
  };
}
