import { authControllerLogin, authControllerRegister } from "@/api";
import LoginModal from "@/components/LoginView/LoginModal";
import useModal from "@/hooks/useModal";
import { toMilliseconds } from "@/utils/timestamp";
import Axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  const {
    open,
    handleOpen: openLoginModal,
    handleClose: closeLoginModal,
  } = useModal();

  const storedToken = localStorage.getItem("token");
  const storedTokenExpiry = localStorage.getItem("tokenExpiry");

  const [token, setToken] = useState<string | null>(storedToken);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(
    storedTokenExpiry ? new Date(storedTokenExpiry) : null
  );
  const [isAuthorized, setIsAuthorized] = useState<boolean>(
    token && tokenExpiry ? tokenExpiry > new Date() : false
  );

  const storeToken = useCallback((token: string, expiry: Date) => {
    Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", expiry.toISOString());

    setToken(token);
    setTokenExpiry(expiry);

    setIsAuthorized(true);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await authControllerLogin({ username, password });
      const { access_token: newToken, expires_in } = response.data;

      const newTokenExpiry = new Date(Date.now() + toMilliseconds(expires_in));
      storeToken(newToken, newTokenExpiry);
    },
    [storeToken]
  );

  const register = useCallback(
    async (username: string, password: string) => {
      const response = await authControllerRegister({ username, password });
      const { access_token: newToken, expires_in } = response.data;

      const newTokenExpiry = new Date(Date.now() + toMilliseconds(expires_in));
      storeToken(newToken, newTokenExpiry);
    },
    [storeToken]
  );

  // TODO: implement token refresh
  // TODO: set isAuthorized to false if the token expires during a session

  const value: AuthContext = useMemo(
    () => ({ login, register, token }),
    [login, register, token]
  );

  useEffect(() => {
    if (isAuthorized) {
      return;
    }
    openLoginModal();
  }, [isAuthorized, openLoginModal]);

  return (
    <AuthContext.Provider value={value}>
      <LoginModal open={open} onClose={closeLoginModal} />
      {children}
    </AuthContext.Provider>
  );
}
