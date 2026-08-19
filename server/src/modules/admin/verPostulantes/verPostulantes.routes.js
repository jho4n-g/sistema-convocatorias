import { Router } from 'express';
import { VerPostulantesController as controller } from '../verPostulantes/verPostulantes.controller.js';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { requirePermission } from '../../../middlewares/requirePermission.middlewares.js';
//
import { ConvocatoriaController as controllerConvocatoria } from '../convocatoria/convocatoria.controller.js';

const routes = new Router();
routes
  .get(
    '/:id',
    requirePermission('postulantes.ver'),
    asyncHandler(controller.getAll),
  )
  .get(
    '/postulante/:id',
    requirePermission('postulantes.ver'),
    asyncHandler(controller.getId),
  )
  //parche 18-08-2026
  .get(
    '/convocatoria/:id',
    requirePermission('postulantes.ver'),
    asyncHandler(controllerConvocatoria.getIdTitulo),
  );

export default routes;
