import { useCallback } from "react";

import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import type { Chapter, Nullable, Subchapter } from "@/types.ts";
import { ChapterItem } from "@/components/ChapterItem.tsx";

type Props = {
  chapters: Chapter[];
  selectedChapter: Nullable<Chapter>;
  selectedSubchapter: Nullable<Subchapter>;
  openChapters: Record<number, boolean>;
  onToggleChapter: (chapterNumber: number) => void;
  onSetSelectedChapter: (chapter: Nullable<Chapter>) => void;
  onSetSelectedSubchapter: (subchapter: Nullable<Subchapter>) => void;
};

export function NavigationContent({
  chapters,
  selectedChapter,
  selectedSubchapter,
  openChapters,
  onToggleChapter,
  onSetSelectedChapter,
  onSetSelectedSubchapter,
}: Props) {
  const handleSubchapterSelect = useCallback(
    (chapter: Chapter, subchapter: Subchapter) => {
      onSetSelectedChapter(chapter);
      onSetSelectedSubchapter(subchapter);
    },
    [onSetSelectedChapter, onSetSelectedSubchapter],
  );

  return (
    <ScrollArea className="h-screen">
      <div className="space-y-4 p-4">
        {chapters.map((chapter) => {
          const isOpen = openChapters[chapter.number];
          const isSelected = selectedChapter?.number === chapter.number;

          return (
            <ChapterItem
              key={chapter.number}
              chapter={chapter}
              isOpen={isOpen}
              isSelected={isSelected}
              selectedSubchapter={selectedSubchapter}
              onChapterToggle={onToggleChapter}
              onSubchapterSelect={handleSubchapterSelect}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}
