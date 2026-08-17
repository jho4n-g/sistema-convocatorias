import { Router } from 'express';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
//-
import {
  experienciaGeneralSchema,
  experienciaGeneralUpdateSchema,
} from './experienciaGeneral.schema.js';
import { ExperienciaGeneralController as controller } from './experienciaGeneral.controller.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get(
    '/',
    requirePermission('experienciaGeneral.ver'),
    asyncHandler(controller.getAll),
  )
  .post(
    '/',
    requirePermission('experienciaGeneral.crear'),
    validateSchema(experienciaGeneralSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('experienciaGeneral.editar'),
    validateSchema(experienciaGeneralUpdateSchema),
    asyncHandler(controller.update),
  );

export default routes;
