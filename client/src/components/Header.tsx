import { PanelLeft, PanelLeftClose } from "lucide-react";
import type { Chapter, Nullable, Subchapter } from "@/types.ts";
import { Button } from "@/components/ui/button.tsx";

type Props = {
  selectedChapter: Nullable<Chapter>;
  selectedSubchapter: Nullable<Subchapter>;
  sidebarOpen: boolean;
  onClick: () => void;
};

export function Header({
  selectedChapter,
  selectedSubchapter,
  sidebarOpen,
  onClick,
}: Props) {
  const Icon = sidebarOpen ? PanelLeftClose : PanelLeft;

  const chapterHeader = selectedChapter
    ? `Chapter ${selectedChapter.number}: ${selectedChapter.title}`
    : "";

  const subchapterHeader = selectedSubchapter ? selectedSubchapter.title : "";

  return (
    <header className="border-b p-4">
      <div className="max-w-4xl mx-auto w-full pl-16 lg:pl-0 flex items-center justify-between">
        <div>
          {chapterHeader && (
            <h1 className="text-2xl font-bold">{chapterHeader}</h1>
          )}
          {subchapterHeader && (
            <p className="text-muted-foreground text-lg">{subchapterHeader}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={onClick}
        >
          <Icon className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
