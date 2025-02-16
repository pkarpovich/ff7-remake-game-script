import { useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

import { Button } from "@/components/ui/button.tsx";
import type { Chapter, Nullable, Subchapter } from "@/types.ts";

type Props = {
  chapter: Chapter;
  isOpen: boolean;
  isSelected: boolean;
  selectedSubchapter: Nullable<Subchapter>;
  onChapterToggle: (chapterId: string) => void;
  onSubchapterSelect: (chapter: Chapter, subchapter: Subchapter) => void;
};

export function ChapterItem({
  chapter,
  isOpen,
  isSelected,
  selectedSubchapter,
  onChapterToggle,
  onSubchapterSelect,
}: Props) {
  const Icon = isOpen ? ChevronUp : ChevronDown;

  const handleSubchapterClick = useCallback(
    (chapter: Chapter, subchapter: Subchapter) => () => {
      onSubchapterSelect(chapter, subchapter);
    },
    [onSubchapterSelect],
  );

  return (
    <div className="rounded-lg border bg-card">
      <div
        className={clsx(
          "flex cursor-pointer items-center justify-between rounded-t-lg p-3 font-semibold hover:bg-accent",
          isSelected && "bg-accent",
        )}
        onClick={() => onChapterToggle(chapter.id)}
      >
        <span className="text-md whitespace-normal break-words leading-normal px-4">
          Chapter {chapter.number}: {chapter.title}
        </span>
        <Icon className="h-4 w-4" />
      </div>
      {isOpen && (
        <div className="p-2 bg-accent/5">
          {chapter.subchapters.map((subchapter) => {
            const variant =
              selectedSubchapter?.title === subchapter.title
                ? "secondary"
                : "ghost";

            return (
              <Button
                key={subchapter.id}
                variant={variant}
                className="w-full justify-start h-auto py-2 text-left"
                onClick={handleSubchapterClick(chapter, subchapter)}
              >
                <span className="text-md whitespace-normal break-words leading-normal">
                  {subchapter.title}
                </span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
