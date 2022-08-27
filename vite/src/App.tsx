import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import ClippingView from "./components/ClippingView/ClippingView";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1e5791",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ClippingView />
    </ThemeProvider>
  );
}

export default App;
