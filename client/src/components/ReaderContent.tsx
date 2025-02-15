import { type JSX } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import type { Dialogue, Nullable, Subchapter } from "@/types.ts";

type Props = {
  selectedSubchapter: Nullable<Subchapter>;
  element: (dialogue: Dialogue, index: number) => JSX.Element;
};

export function ReaderContent({ selectedSubchapter, element }: Props) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-4xl mx-auto w-full space-y-4 pl-16 lg:pl-0">
        {selectedSubchapter?.dialogues.map(element)}
      </div>
    </ScrollArea>
  );
}
