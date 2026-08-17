import { Router } from 'express';
import RolRoutes from './rol/rol.routes.js';

const routes = new Router();

routes.use('/rol', RolRoutes);

export default routes;
