import { useCallback } from "react";

import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import type { Chapter, Nullable, Subchapter } from "@/types.ts";
import { ChapterItem } from "@/components/ChapterItem.tsx";

type Props = {
  chapters: Chapter[];
  selectedChapter: Nullable<Chapter>;
  selectedSubchapter: Nullable<Subchapter>;
  openChapters: Record<string, boolean>;
  onToggleChapter: (chapterId: string) => void;
  onSetSelectedSubchapter: (chapter: Chapter, subchapter: Subchapter) => void;
};

export function NavigationContent({
  chapters,
  selectedChapter,
  selectedSubchapter,
  openChapters,
  onToggleChapter,
  onSetSelectedSubchapter,
}: Props) {
  const handleSubchapterSelect = useCallback(
    (chapter: Chapter, subchapter: Subchapter) => {
      onSetSelectedSubchapter(chapter, subchapter);
    },
    [onSetSelectedSubchapter],
  );

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {chapters.map((chapter) => {
          const isOpen = openChapters[chapter.id];
          const isSelected = selectedChapter?.id === chapter.id;

          return (
            <ChapterItem
              key={chapter.id}
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
