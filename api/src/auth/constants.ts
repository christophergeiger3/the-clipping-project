import { randomUUID } from 'crypto';

// TODO: Move this to the .env.default.ts file
export const JWT_SECRET = randomUUID();
