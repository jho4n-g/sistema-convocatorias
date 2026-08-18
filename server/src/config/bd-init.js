import { sequelize } from './database.js';
//Modulo Auth
import { permisoModel } from '../models/auth/permiso.model.js';
import { rolModel, rolPermisoModel } from '../models/auth/rol.model.js';
import { usuarioModel } from '../models/auth/usuario.model.js';
import { VerificarUsuarioModel } from '../models/auth/verificarCorreo.model.js';
//
import { centroMedicoModel } from '../models/centroMedico.model.js';
import { servicioCentroModel } from '../models/servicioCentro.model.js';
import { personaAdminModel } from '../models/personasAdmin.model.js';
//
import { areaTrabajoModel } from '../models/areaTrabajo.model.js';
import { cargoInstitucionalModel } from '../models/cargoInstitucional.model.js';
import {
  convocatoriaExperienciaEspecificaModel,
  experienciaEspecifica,
} from '../models/experienciaEspecifica.model.js';
import {
  convocatoriaFormacionAcademicaModel,
  formacionAcademicaModel,
  areaTrabajoFormacionAcademicaModel,
} from '../models/formacionAcademica.model.js';
import { experienciaGeneralModel } from '../models/experienciaGeneral.model.js';
//
import { convocatoriaModel } from '../models/convocatoria.model.js';
// parte perona postulante
import { nivelAcademicoModel } from '../models/nivelAcademico.model.js';
import { personaModel } from '../models/persona.model.js';
import { formacionAcademicaPersonaModel } from '../models/formacionAcademicaPersona.js';
import { experienciaLaboralModel } from '../models/experienciaLaboral.model.js';
import { potulacionModel } from '../models/postulacion.model.js';
import { DocumentoPostulacionFormacionAcademicaModel } from '../models/documentoPostulacionFormacion.mode.js';

export async function ConnectBD() {
  try {
    console.log('🌐 Conectando a la base de datos PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión OK');
    // //Modulo Auth
    // await permisoModel.sync();
    // await rolModel.sync();
    // await rolPermisoModel.sync();
    // await usuarioModel.sync({ alter: true });
    // await VerificarUsuarioModel.sync();
    // //
    // //
    // await centroMedicoModel.sync({ alter: true });
    // await servicioCentroModel.sync({ alter: true });
    // await personaAdminModel.sync({ alter: true });
    // //
    // await areaTrabajoModel.sync({ alter: true });
    // await cargoInstitucionalModel.sync({ alter: true });
    // //
    // await experienciaEspecifica.sync({ alter: true });

    // await experienciaGeneralModel.sync({ alter: true });
    // //
    // await formacionAcademicaModel.sync({ alter: true });
    // await areaTrabajoFormacionAcademicaModel.sync({ alter: true });
    // //
    // await convocatoriaModel.sync({ alter: true });
    // //
    // await convocatoriaExperienciaEspecificaModel.sync({ alter: true });
    // await convocatoriaFormacionAcademicaModel.sync({ alter: true });
    // //persona
    // await nivelAcademicoModel.sync({ alter: true });
    // await personaModel.sync({ alter: true });
    // await formacionAcademicaPersonaModel.sync({ alter: true });
    // await experienciaLaboralModel.sync({ alter: true });
    // await potulacionModel.sync({ alter: true });
    // //
    // await DocumentoPostulacionFormacionAcademicaModel.sync({ alter: true });

    // console.log('✅ Tablas cargadas correctamente');
  } catch (e) {
    console.error('❌ Error DB:', e.message);
    process.exit(1);
  }
}

export async function CloseBD() {
  await sequelize.close();
}
