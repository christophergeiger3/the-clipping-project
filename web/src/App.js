import ClipView from "./components/ClipView/ClipView";
import React from "react";

// TODO:
// job queue view / submit job to job queue
// transcode options (e.g. video file type, bitrate, etc.)
// auto-upload clips to 3rd parties
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ClipView />
      </header>
    </div>
  );
}

export default App;
