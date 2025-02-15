import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FONT_SIZE_STORAGE_KEY = "app-font-size";
const DEFAULT_FONT_SIZE = 1;
const MIN_FONT_SIZE = 0.8;
const MAX_FONT_SIZE = 2.5;

type FontSizeContextType = {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
};

const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: 1,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    return savedSize ? parseFloat(savedSize) : DEFAULT_FONT_SIZE;
  });

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      const newSize = Math.min(prev + 0.1, MAX_FONT_SIZE);
      return Number(newSize.toFixed(1));
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      const newSize = Math.max(prev - 0.1, MIN_FONT_SIZE);
      return Number(newSize.toFixed(1));
    });
  }, []);

  return (
    <FontSizeContext.Provider
      value={{ fontSize, increaseFontSize, decreaseFontSize }}
    >
      {children}
    </FontSizeContext.Provider>
  );
}

export function FontSizeControls() {
  const { increaseFontSize, decreaseFontSize } = useContext(FontSizeContext);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={decreaseFontSize}
        aria-label="Decrease font size"
      >
        <MinusCircle className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={increaseFontSize}
        aria-label="Increase font size"
      >
        <PlusCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}

export const useFontSize = () => useContext(FontSizeContext);
