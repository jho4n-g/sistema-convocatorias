import { Router } from 'express';
import { LoginController as controller } from './login.controller.js';
import { asyncHandler } from '../../utils/asynHandler.js';

const routes = new Router();

routes.post('/', asyncHandler(controller.iniciarSesion));
routes.get('/me', asyncHandler(controller.geMe));

export default routes;
