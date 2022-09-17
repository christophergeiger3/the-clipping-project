import { authControllerLogin, authControllerRegister } from "@/api";
import Axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface AuthContext {
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  token: string | null;
}

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Hook must be used within a AuthProvider");
  }

  return context;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = useCallback(async (username: string, password: string) => {
    let response: Awaited<ReturnType<typeof authControllerLogin>>;
    let newToken: string;

    try {
      response = await authControllerLogin({ username, password });
      newToken = response.data.access_token;
    } catch (err) {
      // TODO: throw login error as snackbar
      console.error(err);
      return;
    }

    Axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // return response;
    return;
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    let response: Awaited<ReturnType<typeof authControllerRegister>>;
    let newToken: string;

    try {
      response = await authControllerRegister({ username, password });
      newToken = response.data.access_token;
    } catch (err) {
      // TODO: throw login error as snackbar
      console.error(err);
      return;
    }

    Axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // return response;
    return;
  }, []);

  const value = useMemo(
    () => ({ login, register, token }),
    [login, register, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
