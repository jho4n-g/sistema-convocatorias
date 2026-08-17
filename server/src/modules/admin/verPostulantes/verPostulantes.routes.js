import { Router } from 'express';
import { VerPostulantesController as controller } from '../verPostulantes/verPostulantes.controller.js';
import { asyncHandler } from '../../../utils/asynHandler.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();
routes
  .get(
    '/:id',
    requirePermission('postulantes.ver'),
    asyncHandler(controller.getAll),
  )
  .get(
    '/postulante/:id',
    requirePermission('postulantes.ver'),
    asyncHandler(controller.getId),
  );

export default routes;
