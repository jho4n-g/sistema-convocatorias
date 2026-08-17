import { Router } from 'express';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
//
import { AreaTrabajoController } from '../areaTrabajo/areaTrabajo.controller.js';
import { cargoInstitucionalController as controller } from './cargoInstitucional.controller.js';
import {
  cargoInstitucionalSchema,
  cargoInstitucionalUpdateSchema,
} from './cargoInstitucional.schema.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get(
    '/area-trabajo',
    requirePermission('cargoInstitucional.ver'),
    asyncHandler(AreaTrabajoController.getSelect),
  )
  .get(
    '/',
    requirePermission('cargoInstitucional.ver'),
    asyncHandler(controller.getAll),
  )
  .get(
    '/:id',
    requirePermission('cargoInstitucional.ver'),
    asyncHandler(controller.getId),
  )
  .post(
    '/',
    requirePermission('cargoInstitucional.crear'),
    validateSchema(cargoInstitucionalSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('cargoInstitucional.editar'),
    validateSchema(cargoInstitucionalUpdateSchema),
    asyncHandler(controller.update),
  );

export default routes;
