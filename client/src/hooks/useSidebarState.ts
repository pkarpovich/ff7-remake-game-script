import { useState, useCallback } from "react";

export function useSidebarState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const toggleChapter = useCallback((chapterId: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  }, []);

  return {
    isSidebarOpen,
    openChapters,
    handleToggleSidebar,
    toggleChapter,
  };
}
