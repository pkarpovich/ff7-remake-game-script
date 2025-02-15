import ScriptViewer from "./components/ScriptReader.tsx";
import { ThemeProvider } from "@/providers/theme.tsx";
import { FontSizeProvider } from "@/providers/fontSize.tsx";

function App() {
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <ScriptViewer />
      </FontSizeProvider>
    </ThemeProvider>
  );
}

export default App;
