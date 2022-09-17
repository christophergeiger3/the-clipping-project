import Axios from "axios";
import ClippingView from "@components/ClippingView/ClippingView";
import ClipProvider from "@providers/ClipProvider";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Required for orval client requests (api.ts):
Axios.defaults.baseURL = import.meta.env.VITE_API_URL;
Axios.defaults.headers.common["Content-Type"] = "application/json";
Axios.defaults.headers.common["Accept"] = "application/json";

// Required client for react-query:
const queryClient = new QueryClient({
  defaultOptions: {},
});

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AuthProvider>
          <ClipProvider>
            <ClippingView />
          </ClipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
