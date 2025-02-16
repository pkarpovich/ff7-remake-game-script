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
  console.log(theme);

  return (
    <header className="sticky top-0 z-50 h-24 md:h16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex flex-col md:flex-row h-full max-w-4xl items-center gap-4 px-4">
        <div className="hidden md:flex h-full items-center">
          <img
            src="/logo.svg"
            alt="FF7 Remake Script Reader"
            className="h-8 w-auto"
            style={{
              filter: theme === "dark" ? "invert(1)" : "invert(0)",
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {chapterHeader && (
            <h1 className="truncate text-lg font-semibold leading-tight">
              {chapterHeader}
            </h1>
          )}
          {subchapterHeader && (
            <p className="truncate text-sm text-muted-foreground">
              {subchapterHeader}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
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
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Icon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
