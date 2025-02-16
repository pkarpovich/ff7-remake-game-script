import { useCallback, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import type { Chapter, Nullable, Subchapter } from "../types";

type Options = {
  chapters: Chapter[];
  selectedChapter: Nullable<Chapter>;
  selectedSubchapter: Nullable<Subchapter>;
  setSelectedSubchapter: (chapter: Chapter, subchapter: Subchapter) => void;
};

export function useChaptersNavigation({
  chapters,
  selectedChapter,
  selectedSubchapter,
  setSelectedSubchapter,
}: Options) {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/chapter/:chapterId/subchapter/:subchapterId");

  const updateURL = useCallback(
    (chapter: Chapter, subchapter: Subchapter) => {
      setLocation(`/chapter/${chapter.id}/subchapter/${subchapter.id}`);
    },
    [setLocation],
  );

  useEffect(() => {
    if (!chapters.length) return;

    if (params?.chapterId && params?.subchapterId) {
      const chapter = chapters.find((ch) => ch.id === params.chapterId);
      if (!chapter) {
        return;
      }

      const subchapter = chapter.subchapters.find(
        (sub) => sub.id === params.subchapterId,
      );

      if (!subchapter) {
        return;
      }

      setSelectedSubchapter(chapter, subchapter);
      return;
    }

    if (chapters[0]) {
      setSelectedSubchapter(chapters[0], chapters[0].subchapters[0]);
      updateURL(chapters[0], chapters[0].subchapters[0]);
    }
  }, [chapters, params, setSelectedSubchapter, updateURL]);

  const getCurrentIndices = useCallback(() => {
    if (!selectedChapter || !selectedSubchapter) {
      return { currentChapterIndex: 0, currentSubchapterIndex: 0 };
    }
    const currentChapterIndex = chapters.findIndex(
      (ch) => ch.id === selectedChapter.id,
    );
    const currentSubchapterIndex = selectedChapter.subchapters.findIndex(
      (sub) => sub.id === selectedSubchapter.id,
    );
    return { currentChapterIndex, currentSubchapterIndex };
  }, [chapters, selectedChapter, selectedSubchapter]);

  const getRelativeSubchapter = useCallback(
    (offset: 1 | -1) => {
      if (!selectedChapter || !selectedSubchapter) return null;
      const { currentChapterIndex, currentSubchapterIndex } =
        getCurrentIndices();

      const newSubchapterIndex = currentSubchapterIndex + offset;

      if (
        newSubchapterIndex >= 0 &&
        newSubchapterIndex < selectedChapter.subchapters.length
      ) {
        return {
          chapter: selectedChapter,
          subchapter: selectedChapter.subchapters[newSubchapterIndex],
        };
      }

      if (offset > 0) {
        if (currentChapterIndex < chapters.length - 1) {
          const nextChapter = chapters[currentChapterIndex + 1];
          return {
            chapter: nextChapter,
            subchapter: nextChapter.subchapters[0],
          };
        }
      } else {
        if (currentChapterIndex > 0) {
          const prevChapter = chapters[currentChapterIndex - 1];
          return {
            chapter: prevChapter,
            subchapter:
              prevChapter.subchapters[prevChapter.subchapters.length - 1],
          };
        }
      }

      return null;
    },
    [chapters, getCurrentIndices, selectedChapter, selectedSubchapter],
  );

  const navigateToNextSubchapter = useCallback(() => {
    const result = getRelativeSubchapter(1);
    if (!result) return;

    setSelectedSubchapter(result.chapter, result.subchapter);
    updateURL(result.chapter, result.subchapter);
  }, [getRelativeSubchapter, setSelectedSubchapter, updateURL]);

  const navigateToPrevSubchapter = useCallback(() => {
    const result = getRelativeSubchapter(-1);
    if (!result) return;

    setSelectedSubchapter(result.chapter, result.subchapter);
    updateURL(result.chapter, result.subchapter);
  }, [getRelativeSubchapter, setSelectedSubchapter, updateURL]);

  return {
    chapters,
    selectedChapter,
    selectedSubchapter,
    navigateToNextSubchapter,
    navigateToPrevSubchapter,
    updateURL,
  };
}
