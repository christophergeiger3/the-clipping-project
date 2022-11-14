import { authControllerGetStatus } from "@/api";
import Axios from "axios";
import { isNullable } from "./isNonNullable";

export function isTokenInHeader(token: string) {
  const header = Axios.defaults.headers.common["Authorization"];
  return Boolean(
    header && typeof header === "string" && header.includes(token)
  );
}

export function isTokenExpiryValid(expiry: Date) {
  return expiry > new Date();
}

export async function checkIsAuthorized(
  maybeToken: string | null,
  maybeTokenExpiry: Date | null
) {
  if (isNullable(maybeToken) || isNullable(maybeTokenExpiry)) {
    return false;
  }

  if (!isTokenInHeader(maybeToken) || !isTokenExpiryValid(maybeTokenExpiry)) {
    return false;
  }

  try {
    const authStatus = await authControllerGetStatus();
    return Boolean(authStatus);
  } catch (error) {
    return false;
  }
}

export function saveTokenInRequestHeader(token: string) {
  Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
