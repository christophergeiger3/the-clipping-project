import { randomUUID } from 'crypto';

export const PORT = 4190;
export const ENV = 'production';
export const API_URL = 'http://localhost:4190';
export const DATABASE_URL = 'mongodb://mongo/the-clipping-project';
export const TEST_DATABASE_URL = 'mongodb://mongo/the-clipping-project-test';
export const JWT_TOKEN_EXPIRATION = 3600; // seconds
export const JWT_SECRET = randomUUID();
export const OWNER_USERNAME = 'admin';
export const OWNER_PASSWORD = 'admin';
