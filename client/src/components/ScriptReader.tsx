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
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full z-30 bg-background hidden lg:block border-r transition-transform duration-300 w-80",
          !isSidebarOpen && "-translate-x-full",
        )}
      >
        <div className="pt-20">
          <NavigationContent
            chapters={chapters}
            selectedChapter={selectedChapter}
            selectedSubchapter={selectedSubchapter}
            openChapters={openChapters}
            onToggleChapter={toggleChapter}
            onSetSelectedSubchapter={handleSubchapterSelect}
          />
        </div>
      </aside>

      <main
        className={clsx("flex-1 flex flex-col transition-all duration-300")}
      >
        <Header
          selectedChapter={selectedChapter}
          selectedSubchapter={selectedSubchapter}
          sidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        <ReaderContent
          selectedSubchapter={selectedSubchapter}
          element={(dialogue) => (
            <DialogueCard key={dialogue.id} dialogue={dialogue} />
          )}
        />

        <NavigationFooter
          chapters={chapters}
          selectedChapter={selectedChapter}
          selectedSubchapter={selectedSubchapter}
          onNextButtonClick={navigateToNextSubchapter}
          onPrevButtonClick={navigateToPrevSubchapter}
        />
      </main>
    </div>
  );
}

export default ScriptReader;
