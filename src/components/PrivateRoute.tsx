import { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const auth = useContext(AuthContext);
  return auth?.isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;
