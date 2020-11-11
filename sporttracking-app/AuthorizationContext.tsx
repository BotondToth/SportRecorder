import { createContext } from 'react';

const dummy = () => {};
export const AuthorizationContext = createContext<{ signIn:() => void; signOut: () => void; }>({
  signIn: dummy, signOut: dummy,
});
