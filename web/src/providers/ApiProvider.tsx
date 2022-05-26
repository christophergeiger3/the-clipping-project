import OpenAPIClientAxios from "openapi-client-axios";
import React, { createContext, useContext, useMemo, useState } from "react";
import { Client as TheClippingProjectClient } from "../client";

// Note:
// After updating the API (e.g. adding a new endpoint or controller),
// the client.d.ts file must be regenerated.
// Run `typegen http://localhost:4190/api-json > client.d.ts` to do so.
// (replace `http://localhost:4190` with the URL of a running instance of tcp's updated API)

interface ApiState {
  isApiReady: boolean;
  api: Promise<OpenAPIClientAxios>;
  client: Promise<TheClippingProjectClient>;
}

const ApiContext = createContext<ApiState | undefined>(undefined);

async function initializeApi(): Promise<OpenAPIClientAxios> {
  const api = new OpenAPIClientAxios({
    definition: "http://localhost:4190/api-json",
    axiosConfigDefaults: {
      baseURL: "http://localhost:4190",
      // withCredentials: true,
    },
  });
  await api.init<TheClippingProjectClient>();
  return api;
}

async function initializeClient(
  api: OpenAPIClientAxios
): Promise<TheClippingProjectClient> {
  const client = await api.getClient<TheClippingProjectClient>();
  return client;
}

export function useApi() {
  const [isApiReady, setIsApiReady] = useState(false);

  const api = useMemo(() => {
    return new Promise<OpenAPIClientAxios>(async (resolve, reject) => {
      try {
        const api = await initializeApi();
        resolve(api);
      } catch (e) {
        reject(e);
      }
    });
  }, []);

  const client = useMemo(() => {
    return new Promise<TheClippingProjectClient>(async (resolve, _reject) => {
      const newClient = await initializeClient(await api);
      setIsApiReady(true);
      resolve(newClient);
    });
  }, [api]);

  const apiState = useMemo(() => {
    return {
      isApiReady,
      api,
      client,
    };
  }, [api, client, isApiReady]);

  return apiState;
}

export function useClient() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ApiProvider");
  }

  return {
    client: context.client,
  };
}

export default function ApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { api, client, isApiReady } = useApi();

  const apiState = useMemo<ApiState>(() => {
    return {
      isApiReady,
      api,
      client,
    };
  }, [api, client, isApiReady]);

  return <ApiContext.Provider value={apiState}>{children}</ApiContext.Provider>;
}
