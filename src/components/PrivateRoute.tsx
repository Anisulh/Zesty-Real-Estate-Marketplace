import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Spinner from "./Spinner";

function PrivateRoute() {
  const { loggedIn, loading } = useAuth();
  if (loading) {
    return <Spinner />;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
