export const requirePermission = (...permisosRequeridos) => {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        message: 'No autenticado',
      });
    }

    // SUPER ADMIN pasa siempre
    if (usuario.nombre_rol === 'admin_super_admin') {
      return next();
    }

    const permisosUsuario = usuario.permisos || [];

    const tienePermiso = permisosRequeridos.some((permiso) =>
      permisosUsuario.includes(permiso),
    );

    if (!tienePermiso) {
      return res.status(403).json({
        ok: false,
        message: 'No tiene permisos para realizar esta acción',
      });
    }

    next();
  };
};
