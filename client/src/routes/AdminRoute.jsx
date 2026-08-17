import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario?.nombre_rol === 'UsuarioNormal') {
    return <Navigate to="/mis-postulaciones" replace />;
  }

  return <Outlet />;
}
