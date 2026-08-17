import { Router } from 'express';
// import LoginRoutes from '../modules/login/login.routes.js';
import AdminRoutes from './admin.routes.js';
import PublicRoutes from './public.routes.js';
import LoginRoutes from '../modules/login/login.routes.js';
import UsuarioRoutes from '../modules/usuarioNormal/usuario.routes.js';
import { checkAuch } from '../middlewares/auth.middlewares.js';

const routes = new Router();

routes
  .use('/login', LoginRoutes)
  .use('/public', PublicRoutes)
  .use('/admin', checkAuch, AdminRoutes)
  .use('/usuario', checkAuch, UsuarioRoutes);

export default routes;
