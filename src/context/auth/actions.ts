const LOGIN = "AUTH/LOGIN";
const LOGOUT = "AUTH/LOGOUT";

const loginUser = (name: string) => ({
  type: LOGIN as typeof LOGIN,
  payload: { name },
});
const logoutUser = () => ({ type: LOGOUT as typeof LOGOUT });

export { loginUser, logoutUser };
