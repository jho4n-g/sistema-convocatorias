import { Router } from 'express';
import { CentroMedicoController as controller } from './centroMedico.controller.js';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { centroMedicoSchema } from './centroMedico.schema.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get(
    '/',
    requirePermission('centroMedico.ver'),
    asyncHandler(controller.getAll),
  )
  .get(
    '/seleccion',
    requirePermission('centroMedico.ver'),
    controller.getAllSelect,
  )
  .post(
    '/',
    requirePermission('centroMedico.crear'),
    validateSchema(centroMedicoSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('centroMedico.editar'),
    validateSchema(centroMedicoSchema),
    asyncHandler(controller.update),
  );

export default routes;
