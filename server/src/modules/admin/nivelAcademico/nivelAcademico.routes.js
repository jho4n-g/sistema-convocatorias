import { Router } from 'express';
import { NivelAcademicoController as controller } from './nivelAcademico.controller.js';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { nivelAcademicoSchema } from './nivelAcademico.schema.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get(
    '/',
    requirePermission('nivelAcademico.ver'),
    asyncHandler(controller.getAll),
  )
  .post(
    '/',
    requirePermission('nivelAcademico.crear'),
    validateSchema(nivelAcademicoSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('nivelAcademico.editar'),
    validateSchema(nivelAcademicoSchema),
    asyncHandler(controller.update),
  );

export default routes;
