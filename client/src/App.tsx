import { Route, Switch } from "wouter";
import ScriptReader from "./components/ScriptReader.tsx";
import { ThemeProvider } from "@/providers/theme.tsx";
import { FontSizeProvider } from "@/providers/fontSize.tsx";

function App() {
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <Switch>
          <Route path="/" component={ScriptReader} />
          <Route
            path="/chapter/:chapterId/subchapter/:subchapterId"
            component={ScriptReader}
          />
        </Switch>
      </FontSizeProvider>
    </ThemeProvider>
  );
}

export default App;
