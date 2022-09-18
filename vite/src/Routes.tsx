import { Route, BrowserRouter, Routes } from "react-router-dom";
import ClippingView from "@components/ClippingView/ClippingView";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClippingView />} />
      </Routes>
    </BrowserRouter>
  );
}
