import AllClipsView from "./components/AllClipsView/AllClipsView";
import ClippingView from "@components/ClippingView/ClippingView";
import { Route, BrowserRouter, Routes } from "react-router-dom";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClippingView />} />
        <Route path="/clips" element={<AllClipsView />} />
      </Routes>
    </BrowserRouter>
  );
}
