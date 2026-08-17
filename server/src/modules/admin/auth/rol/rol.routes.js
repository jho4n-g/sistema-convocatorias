import { Router } from 'express';
import { RolController as controller } from './rol.controller.js';
import { asyncHandler } from '../../../../utils/asynHandler.js';
import { validateSchema } from '../../../../middlewares/validateSchema.middlewares.js';
import { rolSchema, rolUpdateSchema } from './rol.schema.js';
import { requirePermission } from '../../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get('/', requirePermission('admin.admin'), asyncHandler(controller.getAll))
  .get(
    '/permisos',
    requirePermission('admin.admin'),
    asyncHandler(controller.getPermisos),
  )
  .get('/:id', requirePermission('admin.admin'), asyncHandler(controller.getId))
  .post(
    '/',
    requirePermission('admin.admin'),
    validateSchema(rolSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('admin.admin'),
    validateSchema(rolUpdateSchema),
    asyncHandler(controller.update),
  )
  .delete(
    '/:id',
    requirePermission('admin.admin'),
    asyncHandler(controller.delete),
  );

export default routes;
