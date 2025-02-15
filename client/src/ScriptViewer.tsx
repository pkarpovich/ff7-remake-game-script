import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import data from "./data/ffvii_remake_script.json";

const ScriptViewer = () => {
  const [scriptData, setScriptData] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSubchapter, setSelectedSubchapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChapterListVisible, setIsChapterListVisible] = useState(true);

  useEffect(() => {
    console.log(data);
    setLoading(false);
    setScriptData(data);
    if (data.chapters && data.chapters.length > 0) {
      setSelectedChapter(data.chapters[0]);
      if (
        data.chapters[0].subchapters &&
        data.chapters[0].subchapters.length > 0
      ) {
        setSelectedSubchapter(data.chapters[0].subchapters[0]);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading script data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsChapterListVisible(!isChapterListVisible)}
            className="relative -ml-2"
          >
            <Menu
              className={`h-4 w-4 transition-transform duration-200 ${!isChapterListVisible ? "rotate-180" : ""}`}
            />
          </Button>
          <CardTitle className="text-2xl text-center flex-1">
            Final Fantasy VII Remake Script Viewer
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-12 gap-4 relative">
        {/* Chapter Selection */}
        <div
          className={`absolute md:relative col-span-4 md:col-span-3 transition-all duration-300 ease-in-out transform z-10
            ${isChapterListVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none md:hidden"}`}
          style={{
            height: "calc(75vh + 120px)", // Высота контента + отступы
          }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Chapters</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <ScrollArea className="h-[calc(75vh - 40px)]">
                <div className="space-y-2">
                  {scriptData.chapters.map((chapter, index) => (
                    <Button
                      key={chapter.number + index}
                      variant={
                        selectedChapter?.number === chapter.number
                          ? "default"
                          : "outline"
                      }
                      className="w-full text-left justify-start px-4 py-2"
                      onClick={() => {
                        setSelectedChapter(chapter);
                        if (
                          chapter.subchapters &&
                          chapter.subchapters.length > 0
                        ) {
                          setSelectedSubchapter(chapter.subchapters[0]);
                        }
                        if (window.innerWidth <= 768) {
                          setIsChapterListVisible(false);
                        }
                      }}
                    >
                      <span className="font-medium">
                        Chapter {chapter.number}:
                      </span>
                      <span className="ml-2 text-sm">{chapter.title}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ease-in-out transform
            ${isChapterListVisible ? "col-span-12 md:col-span-9 md:translate-x-0" : "col-span-12"}`}
        >
          {selectedChapter && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Chapter {selectedChapter.number}: {selectedChapter.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <div className="flex gap-4 h-[75vh]">
                  {/* Subchapters List */}
                  <div className="w-48 md:w-64 border-r pr-4">
                    <h3 className="font-medium mb-4">Scenes</h3>
                    <ScrollArea className="h-full">
                      <div className="space-y-2">
                        {selectedChapter.subchapters.map((subchapter) => (
                          <Button
                            key={subchapter.title}
                            variant={
                              selectedSubchapter?.title === subchapter.title
                                ? "default"
                                : "outline"
                            }
                            className="w-full text-left justify-start px-3 py-2 text-sm"
                            onClick={() => setSelectedSubchapter(subchapter)}
                          >
                            {subchapter.title}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Dialogues */}
                  <div className="flex-1">
                    <h3 className="font-medium mb-4">
                      {selectedSubchapter?.title}
                    </h3>
                    <ScrollArea className="h-full">
                      <div className="space-y-4 pr-4">
                        {selectedSubchapter?.dialogues.map(
                          (dialogue, index) => (
                            <div
                              key={index}
                              className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex gap-2 align-middle"
                            >
                              <div className="font-bold text-blue-600 mb-2 text-sm">
                                {dialogue.character}
                              </div>
                              <div className="text-gray-700">
                                {dialogue.text}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptViewer;
