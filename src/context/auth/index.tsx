import * as React from "react";
import { loginUser, logoutUser } from "./actions";

type TActionsModule = typeof import("./actions");

type TActions = TActionsModule[keyof TActionsModule];

type TState = {
  user: string | null;
};

const initialState: TState = { user: null };

const AuthContext = React.createContext<{
  user: string | null;
  logoutUser: () => void;
  loginUser: (s: string) => void;
}>({
  user: initialState.user,
  logoutUser: () => {},
  loginUser: () => {},
});

const reducer = (state: TState, action: ReturnType<TActions>): TState => {
  switch (action.type) {
    case "AUTH/LOGIN":
      console.log({ action });
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

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loginUser: (s: string) => dispatch(loginUser(s)),
        logoutUser: () => dispatch(logoutUser()),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
