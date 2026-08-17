import { Router } from 'express';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
//
import { FormacionAcademicaController as controller } from './formacionAcademica.controller.js';
import { AreaTrabajoController } from '../areaTrabajo/areaTrabajo.controller.js';
import {
  formacionAcademicaSchema,
  formacionAcademicaUpdateSchema,
} from './formacionAcademica.schema.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get(
    '/',
    requirePermission('formacionAcademica.ver'),
    asyncHandler(controller.getAll),
  )
  .get(
    '/area-trabajo',
    requirePermission('formacionAcademica.ver'),
    asyncHandler(AreaTrabajoController.getSelect),
  )
  .get(
    '/:id',
    requirePermission('formacionAcademica.ver'),
    asyncHandler(controller.getId),
  )
  .post(
    '/',
    requirePermission('formacionAcademica.crear'),
    validateSchema(formacionAcademicaSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('formacionAcademica.editar'),
    validateSchema(formacionAcademicaUpdateSchema),
    asyncHandler(controller.update),
  );

export default routes;
