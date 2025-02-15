import { useState, useEffect, useCallback } from "react";
import { clsx } from "clsx";

import data from "../data/ffvii_remake_script.json";
import { Card, CardContent } from "@/components/ui/card";
import type { Chapter, Nullable, Subchapter } from "../types";
import { Header } from "@/components/Header.tsx";
import { ReaderContent } from "@/components/ReaderContent.tsx";
import { NavigationFooter } from "@/components/NavigationFooter.tsx";
import { NavigationContent } from "@/components/NavigationContent.tsx";

export function ScriptReader() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] =
    useState<Nullable<Chapter>>(null);
  const [selectedSubchapter, setSelectedSubchapter] =
    useState<Nullable<Subchapter>>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setChapters(data.chapters);
    if (!data.chapters.length) {
      return;
    }

    setSelectedChapter(data.chapters[0]);
    if (data.chapters[0].subchapters.length > 0) {
      setSelectedSubchapter(data.chapters[0].subchapters[0]);
    }
  }, []);

  const toggleChapter = useCallback((chapterNumber: number) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterNumber]: !prev[chapterNumber],
    }));
  }, []);

  const getCurrentIndices = useCallback(() => {
    const currentChapterIndex = chapters.findIndex(
      (ch) => ch.number === selectedChapter!.number,
    );
    const currentSubchapterIndex = selectedChapter!.subchapters.findIndex(
      (sub) => sub.title === selectedSubchapter!.title,
    );
    return { currentChapterIndex, currentSubchapterIndex };
  }, [chapters, selectedChapter, selectedSubchapter]);

  const navigateToNextSubchapter = useCallback(() => {
    if (!selectedChapter || !selectedSubchapter) return;

    const { currentChapterIndex, currentSubchapterIndex } = getCurrentIndices();

    if (currentSubchapterIndex < selectedChapter.subchapters.length - 1) {
      setSelectedSubchapter(
        selectedChapter.subchapters[currentSubchapterIndex + 1],
      );
    } else if (currentChapterIndex < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      setSelectedChapter(nextChapter);
      setSelectedSubchapter(nextChapter.subchapters[0]);
    }
  }, [chapters, getCurrentIndices, selectedChapter, selectedSubchapter]);

  const navigateToPrevSubchapter = useCallback(() => {
    if (!selectedChapter || !selectedSubchapter) return;

    const { currentChapterIndex, currentSubchapterIndex } = getCurrentIndices();

    if (currentSubchapterIndex > 0) {
      setSelectedSubchapter(
        selectedChapter.subchapters[currentSubchapterIndex - 1],
      );
    } else if (currentChapterIndex > 0) {
      const prevChapter = chapters[currentChapterIndex - 1];
      setSelectedChapter(prevChapter);
      setSelectedSubchapter(
        prevChapter.subchapters[prevChapter.subchapters.length - 1],
      );
    }
  }, [chapters, getCurrentIndices, selectedChapter, selectedSubchapter]);

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
            onSetSelectedChapter={setSelectedChapter}
            onSetSelectedSubchapter={setSelectedSubchapter}
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
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <ReaderContent
          selectedSubchapter={selectedSubchapter}
          element={(dialogue, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardContent className="p-4">
                <div className="font-bold text-primary mb-1">
                  {dialogue.character}
                </div>
                <div className="text-card-foreground">{dialogue.text}</div>
              </CardContent>
            </Card>
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
