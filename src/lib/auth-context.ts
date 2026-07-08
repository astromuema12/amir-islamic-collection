import { AsyncLocalStorage } from "async_hooks";

export interface AuthContext {
  userId: string;
  role: string;
}

export const authContext = new AsyncLocalStorage<AuthContext>();

export function getAuthContext(): AuthContext | undefined {
  return authContext.getStore();
}
