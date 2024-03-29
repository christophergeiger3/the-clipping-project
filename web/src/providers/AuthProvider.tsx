import { authControllerLogin, authControllerRegister } from "@/api";
import LoginModal from "@/components/LoginView/LoginModal";
import useModal from "@/hooks/useModal";
import { checkIsAuthorized, saveTokenInRequestHeader } from "@/utils/auth";
import { toMilliseconds } from "@/utils/timestamp";
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

  const storeToken = useCallback((token: string, expiry: Date) => {
    saveTokenInRequestHeader(token);

    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", expiry.toISOString());

    setToken(token);
    setTokenExpiry(expiry);
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

  const openLoginModalIfNotAuthorized = useCallback(async () => {
    const isAuthorized = await checkIsAuthorized(token, tokenExpiry);
    if (isAuthorized) {
      closeLoginModal();
      return;
    }

    openLoginModal();
  }, [closeLoginModal, openLoginModal, token, tokenExpiry]);

  // TODO: implement token refresh
  // TODO: set isAuthorized to false if the token expires during a session

  const value: AuthContext = useMemo(
    () => ({ login, register, token }),
    [login, register, token]
  );

  useEffect(() => {
    if (token === null) {
      return;
    }
    saveTokenInRequestHeader(token);
  }, [token]);

  useEffect(() => {
    openLoginModalIfNotAuthorized();
  }, [openLoginModalIfNotAuthorized]);

  return (
    <AuthContext.Provider value={value}>
      <LoginModal open={open} onClose={closeLoginModal} />
      {children}
    </AuthContext.Provider>
  );
}
