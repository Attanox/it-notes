import * as React from "react";
import { loginUser, logoutUser } from "./actions";

type TActionsModule = typeof import("./actions");

type TActions = TActionsModule[keyof TActionsModule];

type TState = {
  user: string | null;
};

const initialState: TState = { user: null };

const AuthAPIContext = React.createContext<{
  logoutUser: () => void;
  loginUser: (s: string) => void;
}>({
  logoutUser: () => {},
  loginUser: () => {},
});

const AuthUserContext = React.createContext<{
  user: string | null;
}>({
  user: initialState.user,
});

const reducer = (state: TState, action: ReturnType<TActions>): TState => {
  switch (action.type) {
    case "AUTH/LOGIN":
      return {
        ...state,
        user: action.payload?.name,
      };
    case "AUTH/LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const api = React.useMemo(
    () => ({
      loginUser: (s: string) => dispatch(loginUser(s)),
      logoutUser: () => dispatch(logoutUser()),
    }),
    []
  );

  return (
    <AuthUserContext.Provider value={{ user: state.user }}>
      <AuthAPIContext.Provider value={api}>{children}</AuthAPIContext.Provider>
    </AuthUserContext.Provider>
  );
};

export const useAuthAPI = () => React.useContext(AuthAPIContext);
export const useAuthUser = () => React.useContext(AuthUserContext);
