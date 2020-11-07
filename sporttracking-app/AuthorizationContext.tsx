import { createContext } from 'react';

// @ts-ignore
export const AuthorizationContext = createContext<{ signIn:() => void; signOut: () => void; }>();
