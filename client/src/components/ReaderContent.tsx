import { type JSX } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import type { Dialogue, Nullable, Subchapter } from "@/types.ts";
import { useFontSize } from "@/providers/fontSize.tsx";

type Props = {
  selectedSubchapter: Nullable<Subchapter>;
  element: (dialogue: Dialogue) => JSX.Element;
};

export function ReaderContent({ selectedSubchapter, element }: Props) {
  const { fontSize } = useFontSize();

  return (
    <ScrollArea className="flex-1 p-4" style={{ fontSize: `${fontSize}rem` }}>
      <div className="max-w-4xl mx-auto w-full space-y-4">
        {selectedSubchapter?.dialogues.map(element)}
      </div>
    </ScrollArea>
  );
}
