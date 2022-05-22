import AppWrapper from "./components/AppWrapper";
import ClipView from "./components/ClipView/ClipView";
import Clip from "./components/Clip";
import Clips from "./components/Clips/Clips";
import Progress from "./components/Progress";
import { Route, BrowserRouter, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route
              path="/clips"
              element={
                <AppWrapper>
                  <Clips />
                </AppWrapper>
              }
            />
            <Route
              path="/clips/progress/:id"
              element={
                <AppWrapper>
                  <Progress />
                </AppWrapper>
              }
            />
            <Route path="/clips/:id" element={<Clip />} />
            <Route
              path="/"
              element={
                <AppWrapper>
                  <ClipView />
                </AppWrapper>
              }
            />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
