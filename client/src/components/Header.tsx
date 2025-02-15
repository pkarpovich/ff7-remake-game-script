import { useCallback } from "react";
import { PanelLeft, PanelLeftClose, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Chapter, Nullable, Subchapter } from "@/types";
import { useTheme } from "@/providers/theme";
import { FontSizeControls } from "@/providers/fontSize.tsx";

type Props = {
  selectedChapter: Nullable<Chapter>;
  selectedSubchapter: Nullable<Subchapter>;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export function Header({
  selectedChapter,
  selectedSubchapter,
  sidebarOpen,
  onToggleSidebar,
}: Props) {
  const { theme, setTheme } = useTheme();

  const Icon = sidebarOpen ? PanelLeftClose : PanelLeft;

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  const chapterHeader = selectedChapter
    ? `Chapter ${selectedChapter.number}: ${selectedChapter.title}`
    : "";

  const subchapterHeader = selectedSubchapter ? selectedSubchapter.title : "";

  const handleToggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  return (
    <header className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto w-full pl-16 lg:pl-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            {chapterHeader && (
              <h1 className="text-2xl font-bold leading-none mb-1">
                {chapterHeader}
              </h1>
            )}
            {subchapterHeader && (
              <p className="text-muted-foreground text-lg leading-none">
                {subchapterHeader}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FontSizeControls />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
          >
            <ThemeIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Icon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
