import { asyncHandler } from '../../utils/asynHandler.js';
import { PersonaController as controller } from '../admin/persona/persona.controller.js';
import { NivelAcademicoController } from '../admin/nivelAcademico/nivelAcademico.controller.js';
import { uploadPdf } from '../../middlewares/uploadPdf.middleware.js';
import { ConvocatoriaController } from '../public/convocatoria/convocatoria.controller.js';
import { Router } from 'express';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { PersonaSchema } from '../admin/persona/persona.schema.js';

const routes = new Router();

routes
  .post(
    '/:postulacionId',
    uploadPdf.any(),
    validateSchema(PersonaSchema),
    asyncHandler(controller.registre),
  )
  .get('/nivel-academico', asyncHandler(NivelAcademicoController.getAllSelect))
  .get('/documentos/:id', asyncHandler(ConvocatoriaController.getDocuments));

export default routes;
