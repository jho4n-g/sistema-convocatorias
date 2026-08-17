import { UsuarioController as controller } from './usuario.controller.js';
import { Router } from 'express';
import { asyncHandler } from '../../utils/asynHandler.js';

const routes = new Router();

routes
  .get('/auth/me', asyncHandler(controller.getMe))
  .get('/postulaciones', asyncHandler(controller.listaPostulaciones))
  .get('/documentos/ver/:id', asyncHandler(controller.obtenerDocumento))
  .get('/documentos/:id', asyncHandler(controller.ListaDocumentos));

export default routes;
