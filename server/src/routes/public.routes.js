import { Router } from 'express';
import ConvocatoriaRoutes from '../modules/public/convocatoria/convocatoria.routes.js';
import PersonaRoutes from '../modules/public/persona.routes.js';
const routes = new Router();

routes.use('/convocatoria', ConvocatoriaRoutes).use('/persona', PersonaRoutes);

export default routes;
