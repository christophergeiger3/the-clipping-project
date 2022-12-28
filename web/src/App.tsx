import Axios from "axios";
import ClipProvider from "@providers/ClipProvider";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./providers/AuthProvider";
import AppRoutes from "./Routes";
import { API_URL } from "./env";
import { SnackbarProvider } from "notistack";

// Required for orval client requests (api.ts):
Axios.defaults.baseURL = API_URL;
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
    <SnackbarProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <AuthProvider>
            <ClipProvider>
              <AppRoutes />
            </ClipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  );
}

export default App;
