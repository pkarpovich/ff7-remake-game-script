import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Chapter, Nullable, Subchapter } from "@/types.ts";

type Props = {
  chapters: Chapter[];
  selectedChapter: Nullable<Chapter>;
  selectedSubchapter: Nullable<Subchapter>;
  onNextButtonClick?: () => void;
  onPrevButtonClick?: () => void;
};

export function NavigationFooter({
  chapters,
  selectedSubchapter,
  selectedChapter,
  onNextButtonClick,
  onPrevButtonClick,
}: Props) {
  let isPrevButtonDisabled = true;
  let isNextButtonDisabled = true;

  if (selectedChapter && selectedSubchapter) {
    const isFirstChapter = selectedChapter.number === chapters[0].number;
    const isLastChapter =
      selectedChapter.number === chapters[chapters.length - 1].number;
    const currentSubchapterIndex =
      selectedChapter.subchapters.indexOf(selectedSubchapter);

    isPrevButtonDisabled = isFirstChapter && currentSubchapterIndex === 0;
    isNextButtonDisabled =
      isLastChapter &&
      currentSubchapterIndex === selectedChapter.subchapters.length - 1;
  }

  return (
    <div className="border-t p-4">
      <div className="max-w-4xl mx-auto w-full pl-16 lg:pl-0 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevButtonClick}
          disabled={isPrevButtonDisabled}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={onNextButtonClick}
          disabled={isNextButtonDisabled}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
