import ScriptViewer from "./components/ScriptReader.tsx";
import { ThemeProvider } from "@/providers/theme.tsx";

function App() {
  return (
    <ThemeProvider>
      <ScriptViewer />
    </ThemeProvider>
  );
}

export default App;
