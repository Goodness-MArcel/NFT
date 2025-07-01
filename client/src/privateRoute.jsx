import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <div>loading ...</div>;
  }
  return currentUser ? children : <Navigate to="/login"></Navigate>;
}
export default PrivateRoute;
