import { Navigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuthContext();


  if (loading) {
    return null;
  }

  if (!user) {
    const token = localStorage.getItem("token");

    if (token) {
      return null;
    }

    return <Navigate to="/login-barbero" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login-barbero" replace />;
  }


  return children;
}
