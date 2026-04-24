import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!user && !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
