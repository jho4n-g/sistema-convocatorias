import { Router } from 'express';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { ConvocatoriaController as controller } from './convocatoria.controller.js';
const routes = new Router();

routes
  .get('/', asyncHandler(controller.getAll))
  .get('/:id', asyncHandler(controller.getId))
  .get('/documentos/:id', asyncHandler(controller.getDocuments));

export default routes;
