import { Router } from 'express';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
//-
import { areaTrabajoSchema } from './areaTrabajo.schema.js';
import { AreaTrabajoController as controller } from './areaTrabajo.controller.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get(
    '/',
    requirePermission('areaTrabajo.ver'),
    asyncHandler(controller.getAll),
  )
  .post(
    '/',
    requirePermission('areaTrabajo.crear'),
    validateSchema(areaTrabajoSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('areaTrabajo.editar'),
    validateSchema(areaTrabajoSchema),
    asyncHandler(controller.update),
  );

export default routes;
