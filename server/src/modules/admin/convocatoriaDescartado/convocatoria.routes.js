import { Router } from 'express';
import { ConvocatoriaController as controller } from './convocatoria.controller.js';
import { asyncHandler } from '../../../utils/asynHandler.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import {
  convocatoriaSchema,
  convocatoriaUpdateSchema,
} from './convocatoria.schema.js';
const routes = new Router();

routes
  .get('/', asyncHandler(controller.getAll))
  .get('/:id', asyncHandler(controller.getId))
  .post(
    '/',
    validateSchema(convocatoriaSchema),
    asyncHandler(controller.create),
  )
  .patch(
    '/:id',
    validateSchema(convocatoriaUpdateSchema),
    asyncHandler(controller.update),
  );

export default routes;
