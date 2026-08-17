import { Router } from 'express';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
//-
import { experienciaEspecificaSchema } from './experienciaEspecifica.schema.js';
import { ExperienciaEspecificaController as controller } from './experienciaEspecifica.controller.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get(
    '/',
    requirePermission('experienciaEspecifica.ver'),
    asyncHandler(controller.getAll),
  )
  .post(
    '/',
    requirePermission('experienciaEspecifica.crear'),
    validateSchema(experienciaEspecificaSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('experienciaEspecifica.editar'),
    validateSchema(experienciaEspecificaSchema),
    asyncHandler(controller.update),
  );

export default routes;
