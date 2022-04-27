import AppWrapper from "./components/AppWrapper";
import ClipView from "./components/ClipView/ClipView";
import Clip from "./components/Clip";
import Clips from "./components/Clip";
import Progress from "./components/Progress";
import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

// TODO:
// job queue view / submit job to job queue
// transcode options (e.g. video file type, bitrate, etc.)
// auto-upload clips to 3rd parties
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
