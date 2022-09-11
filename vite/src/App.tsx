import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import ClippingView from "@components/ClippingView/ClippingView";
import ClipProvider from "@providers/ClipProvider";

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
      <ClipProvider>
        <ClippingView />
      </ClipProvider>
    </ThemeProvider>
  );
}

export default App;
