import { useCallback } from "react";
import { clsx } from "clsx";

import type { Chapter, Subchapter } from "../types";
import { Header } from "@/components/Header.tsx";
import { ReaderContent } from "@/components/ReaderContent.tsx";
import { NavigationFooter } from "@/components/NavigationFooter.tsx";
import { NavigationContent } from "@/components/NavigationContent.tsx";
import DialogueCard from "@/components/DialogueCard.tsx";
import { useChaptersData } from "@/hooks/useChaptersData.ts";
import { useChaptersNavigation } from "@/hooks/useChaptersNavigation";
import { useSidebarState } from "@/hooks/useSidebarState.ts";

export function ScriptReader() {
  const {
    chapters,
    selectedChapter,
    selectedSubchapter,
    setSelectedSubchapter,
  } = useChaptersData();

  const { navigateToNextSubchapter, navigateToPrevSubchapter, updateURL } =
    useChaptersNavigation({
      chapters,
      selectedChapter,
      selectedSubchapter,
      setSelectedSubchapter,
    });

  const { isSidebarOpen, openChapters, handleToggleSidebar, toggleChapter } =
    useSidebarState();

  const handleSubchapterSelect = useCallback(
    (chapter: Chapter, subchapter: Subchapter) => {
      setSelectedSubchapter(chapter, subchapter);
      updateURL(chapter, subchapter);
    },
    [setSelectedSubchapter, updateURL],
  );

  return (
    <div className="flex h-[100dvh] flex-col">
      <Header
        selectedChapter={selectedChapter}
        selectedSubchapter={selectedSubchapter}
        sidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="relative flex-1 overflow-hidden">
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/50 lg:hidden"
            onClick={handleToggleSidebar}
          />
        )}
        <aside
          className={clsx(
            "absolute inset-y-0 left-0 z-40 w-80 border-r bg-background transition-transform duration-300",
            !isSidebarOpen && "-translate-x-full",
          )}
        >
          <NavigationContent
            chapters={chapters}
            selectedChapter={selectedChapter}
            selectedSubchapter={selectedSubchapter}
            openChapters={openChapters}
            onToggleChapter={toggleChapter}
            onSetSelectedSubchapter={handleSubchapterSelect}
          />
        </aside>

        <main className="h-full overflow-hidden">
          <ReaderContent
            selectedSubchapter={selectedSubchapter}
            element={(dialogue) => (
              <DialogueCard key={dialogue.id} dialogue={dialogue} />
            )}
          />
        </main>
      </div>

      <NavigationFooter
        chapters={chapters}
        selectedChapter={selectedChapter}
        selectedSubchapter={selectedSubchapter}
        onNextButtonClick={navigateToNextSubchapter}
        onPrevButtonClick={navigateToPrevSubchapter}
      />
    </div>
  );
}

export default ScriptReader;
