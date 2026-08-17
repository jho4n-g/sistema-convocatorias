import { Router } from 'express';
import { PersonaAdminController as controller } from './personaAdmin.controller.js';
import { ServicioMedicoController } from '../servicioCentro/servicioCentro.controller.js';
import { CentroMedicoController } from '../centroMedico/centroMedico.controller.js';
import { RolController } from '../auth/rol/rol.controller.js';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import {
  personaAdminSchema,
  personaAdminUpdateSchema,
} from './personaAdmin.schema.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get('/', requirePermission('admin.admin'), asyncHandler(controller.getAll))
  .get(
    '/centros-medicos',
    requirePermission('admin.admin'),
    asyncHandler(CentroMedicoController.getAllSelect),
  )
  .get(
    '/roles',
    requirePermission('admin.admin'),
    asyncHandler(RolController.getAllSelect),
  )
  .get(
    '/servicios/:id',
    requirePermission('admin.admin'),
    asyncHandler(ServicioMedicoController.getAllSelect),
  )
  .get('/:id', requirePermission('admin.admin'), asyncHandler(controller.getId))
  .post(
    '/',
    requirePermission('admin.admin'),
    validateSchema(personaAdminSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('admin.admin'),
    validateSchema(personaAdminUpdateSchema),
    asyncHandler(controller.update),
  )
  .patch(
    '/cambiar-estado/:id',
    requirePermission('admin.admin'),
    asyncHandler(controller.cambiarEstado),
  );

export default routes;
