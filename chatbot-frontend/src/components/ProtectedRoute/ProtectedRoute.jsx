import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectPath }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
