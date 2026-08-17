import { Router } from 'express';
import AuthRoutes from '../modules/admin/auth/index.routes.js';
//
import CentroMedicoRoutes from '../modules/admin/centroMedico/centroMedico.routes.js';
import ServicioCentroRoutes from '../modules/admin/servicioCentro/servicioCentro.routes.js';
import PersonaAdminRoutes from '../modules/admin/PersonaAdmin/personaAdmin.routes.js';
//
import AreaTrabajoRoutes from '../modules/admin/areaTrabajo/areaTrabajo.routes.js';
import CargoInstitucionalRoutes from '../modules/admin/cargoInstitucional/cargoInstitucional.routes.js';
import FormacionAcademicaRoutes from '../modules/admin/formacionAcamedica/formacionAcademica.routes.js';
import ExperienciaEspecificaRoutes from '../modules/admin/experienciaEspecifica/experienciaEspecifica.routes.js';
import ExperienciaGeneralRoutes from '../modules/admin/experienciaGeneral/experienciaGeneral.routes.js';
import ConvocatoriaRoutes from '../modules/admin/convocatoria/convocatoria.routes.js';
//--------------------------------------------------------------------------------------------
//Persona
import NivelAcademicoRoutes from '../modules/admin/nivelAcademico/nivelAcademico.routes.js';
import VerPostulantesRoutes from '../modules/admin/verPostulantes/verPostulantes.routes.js';

const routes = new Router();

routes
  .use('/auth', AuthRoutes)
  .use('/centro-medico', CentroMedicoRoutes)
  .use('/servicio-centro', ServicioCentroRoutes)
  .use('/persona', PersonaAdminRoutes)
  //Partes para crear una convocatoria segun el cuadro de equivalencia
  .use('/area-trabajo', AreaTrabajoRoutes)
  .use('/cargo-institucional', CargoInstitucionalRoutes)
  .use('/formacion-academica', FormacionAcademicaRoutes)
  .use('/experiencia-especifica', ExperienciaEspecificaRoutes)
  .use('/experiencia-general', ExperienciaGeneralRoutes)
  .use('/convocatoria', ConvocatoriaRoutes)
  // Parte persona postulante
  .use('/nivel-academico', NivelAcademicoRoutes)
  .use('/ver-postulantes', VerPostulantesRoutes);

//  .use('/persona', PersonaRoutes)
export default routes;
