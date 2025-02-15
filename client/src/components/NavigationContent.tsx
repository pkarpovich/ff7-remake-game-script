import { useCallback } from "react";
import { ScrollText } from "lucide-react";

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
    <ScrollArea className="h-screen w-80 p-4">
      <div className="flex items-center gap-2 p-4 sticky top-0 bg-background z-10">
        <ScrollText className="h-6 w-6" />
        <h2 className="text-2xl font-semibold">FF7 Script</h2>
      </div>
      <div className="space-y-4">
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
