import * as defaults from "./env.default";

export const API_URL: string = import.meta.env.VITE_API_URL || defaults.API_URL;
