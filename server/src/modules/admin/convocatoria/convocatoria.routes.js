import { Router } from 'express';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
//
import { ConvocatoriaController as controller } from './convocatoria.controller.js';
//
import { AreaTrabajoController } from '../areaTrabajo/areaTrabajo.controller.js';
import { cargoInstitucionalController } from '../cargoInstitucional/cargoInstitucional.controller.js';
//
import { CentroMedicoController } from '../centroMedico/centroMedico.controller.js';
import { ServicioMedicoController } from '../servicioCentro/servicioCentro.controller.js';
//
import { ExperienciaGeneralController } from '../experienciaGeneral/experienciaGeneral.controller.js';
import { ExperienciaEspecificaController } from '../experienciaEspecifica/experienciaEspecifica.controller.js';
import { FormacionAcademicaController } from '../formacionAcamedica/formacionAcademica.controller.js';
import {
  convocatoriaSchema,
  convocatoriaUpdateSchema,
} from './convocatoria.schema.js';

import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';

const routes = new Router();

routes
  .get(
    '/',
    requirePermission('convocatoria.ver'),
    asyncHandler(controller.getAll),
  )
  .get(
    '/area-trabajo',
    requirePermission('convocatoria.ver'),
    asyncHandler(AreaTrabajoController.getSelect),
  )
  .get(
    '/centro-medico',
    requirePermission('convocatoria.ver'),
    asyncHandler(CentroMedicoController.getAllSelect),
  )
  .get(
    '/experiencia-especifica',
    requirePermission('convocatoria.ver'),
    asyncHandler(ExperienciaEspecificaController.getSelect),
  )
  .get(
    '/experiencia-general',
    requirePermission('convocatoria.ver'),
    asyncHandler(ExperienciaGeneralController.getSelect),
  )
  .get(
    '/servicio-medico/:id',
    requirePermission('convocatoria.ver'),
    asyncHandler(ServicioMedicoController.getAllSelect),
  )
  .get(
    '/cargo-institucional/:id',
    requirePermission('convocatoria.ver'),
    asyncHandler(cargoInstitucionalController.getSelect),
  )
  .get(
    '/formacion-academica/:id',
    requirePermission('convocatoria.ver'),
    asyncHandler(FormacionAcademicaController.getSelect),
  )
  .get(
    '/:id',
    requirePermission('convocatoria.ver'),
    asyncHandler(controller.getId),
  )
  .post(
    '/',
    requirePermission('convocatoria.crear'),
    validateSchema(convocatoriaSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    requirePermission('convocatoria.editar'),
    validateSchema(convocatoriaUpdateSchema),
    asyncHandler(controller.update),
  );

export default routes;
