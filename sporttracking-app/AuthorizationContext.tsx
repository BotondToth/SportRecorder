import { createContext } from 'react';

export const AuthorizationContext = createContext<{ signIn: () => void; signOut: () => void; }>();