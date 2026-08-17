import { Router } from 'express';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { ServicioMedicoController as controller } from './servicioCentro.controller.js';
import {
  servicioCentroSchema,
  servicioCentroUpdateSchema,
} from './servicioCentro.schema.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get(
    '/',
    requirePermission('servicioCentro.ver'),
    asyncHandler(controller.getAll),
  )
  .get(
    '/:id',
    requirePermission('servicioCentro.ver'),
    asyncHandler(controller.getId),
  )
  .post(
    '/',
    requirePermission('servicioCentro.crear'),
    validateSchema(servicioCentroSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('servicioCentro.editar'),
    validateSchema(servicioCentroUpdateSchema),
    asyncHandler(controller.update),
  )
  .patch(
    '/cambiar-estado/:id',
    requirePermission('servicioCentro.deshabilitar'),
    asyncHandler(controller.cambiarEstado),
  );

export default routes;
