import bcrypt from 'bcrypt';
import { usuarioModel } from '../../../models/auth/usuario.model.js';
import { personaModel } from '../../../models/persona.model.js';
import { experienciaLaboralModel } from '../../../models/experienciaLaboral.model.js';
import { formacionAcademicaPersonaModel } from '../../../models/formacionAcademicaPersona.js';
import { nivelAcademicoModel } from '../../../models/nivelAcademico.model.js';
//
import { potulacionModel } from '../../../models/postulacion.model.js';
import { DocumentoPostulacionFormacionAcademicaModel } from '../../../models/documentoPostulacionFormacion.mode.js';
import { sequelize } from '../../../config/database.js';
import { convocatoriaModel } from '../../../models/convocatoria.model.js';
import { convocatoriaFormacionAcademicaModel } from '../../../models/formacionAcademica.model.js';
import { Op } from 'sequelize';
import { rolModel } from '../../../models/auth/rol.model.js';

export class PersonaServices {
  static async register(convocatoria_id, payload, archivos) {
    return sequelize.transaction(async (t) => {
      const {
        trabajo_anteriormente_institucion,
        cedula_identidad,
        correo,
        contrasenia,
        formaciones = [],
        experiencias = [],
        ...parent
      } = payload;

      //convocatoria
      const convocatoriaSearch = await convocatoriaModel.findByPk(
        convocatoria_id,
        {
          transaction: t,
        },
      );

      if (!convocatoriaSearch) {
        const err = new Error('No se encontro la convocatorias');
        err.statusCode = 404;
        throw err;
      }
      //_______________PERSONA_______________________________________________
      const cedulaExit = await personaModel.findOne({
        where: {
          cedula_identidad,
        },
        transaction: t,
      });

      if (cedulaExit) {
        const err = new Error('Ya hay un registro con esa cedula de identidad');
        err.statusCode = 404;
        throw err;
      }
      const usuarioExist = await usuarioModel.findOne({
        where: { correo: cedula_identidad },
        transaction: t,
      });
      if (usuarioExist) {
        const err = new Error('Ya hay un registro con esa cedula de identidad');
        err.statusCode = 409;
        throw err;
      }
      //------------------------------crear usuario-----------------------------
      const pass = await bcrypt.hash(contrasenia, 10);

      const rolSearch = await rolModel.findOne({
        where: {
          nombre_rol: 'UsuarioNormal',
        },
      });

      const usuarioCreated = await usuarioModel.create(
        {
          correo: cedula_identidad,
          contrasenia: pass,
          rol_id: rolSearch.id,
        },
        { transaction: t },
      );

      //-----------------------------crear persona--------------------------------------------

      const personaCreated = await personaModel.create(
        {
          usuario_id: usuarioCreated.id,
          cedula_identidad,
          correo,
          ...parent,
        },
        {
          transaction: t,
        },
      );

      // ----------------------------formacion academica--------------------------------------

      const formacionAcademicaNorm = formaciones.map((row) => ({
        ...row,
        persona_id: personaCreated.id,
      }));

      await formacionAcademicaPersonaModel.bulkCreate(formacionAcademicaNorm, {
        transaction: t,
      });
      // -----------------------------experiencia-------------------------------------
      const experienciaNorm = experiencias.map((row) => ({
        ...row,
        persona_id: personaCreated.id,
      }));
      await experienciaLaboralModel.bulkCreate(experienciaNorm, {
        transaction: t,
      });
      // ------------------------------pdf--------------------------------------
      const idsRequisitos = archivos.map((row) =>
        Number(row.fieldname.replace('documento_', '')),
      );

      const validarRequisitosIds =
        await convocatoriaFormacionAcademicaModel.findAll({
          where: {
            convocatoria_id,
            id: {
              [Op.in]: idsRequisitos,
            },
          },
          attributes: ['id'],
          raw: true,
          transaction: t,
        });

      const idsEncontrados = new Set(
        validarRequisitosIds.map((item) => item.id),
      );

      const idsNoEncontrados = idsRequisitos.filter(
        (id) => !idsEncontrados.has(id),
      );

      if (idsNoEncontrados.length > 0) {
        const err = new Error(
          `No existen los siguientes requisitos IDs: ${idsNoEncontrados.join(', ')}`,
        );
        err.statusCode = 404;
        throw err;
      }

      //---------------------------postulaion-----------------------------------
      const postulacionCreates = await potulacionModel.create(
        {
          convocatoria_id,
          persona_id: personaCreated.id,
          trabajo_anteriormente_institucion,
          estado: 'ENVIADO',
        },
        {
          transaction: t,
        },
      );

      const archivosNormalizados = archivos.map((row) => {
        const requisitoId = Number(row.fieldname.replace('documento_', ''));
        return {
          postulacion_id: postulacionCreates.id,
          convocatoria_formacion_di: requisitoId,
          path: row.path,
        };
      });

      const documetosFromacionCreated =
        await DocumentoPostulacionFormacionAcademicaModel.bulkCreate(
          archivosNormalizados,
          { transaction: t },
        );

      const postulacionReload = await potulacionModel.findByPk(
        postulacionCreates.id,
        {
          include: [
            {
              model: personaModel,
              as: 'personaPostulacion',
            },
            {
              model: DocumentoPostulacionFormacionAcademicaModel,
              as: 'documentosPostulacion',
            },
          ],
          transaction: t,
        },
      );

      return postulacionReload;
    });
  }
}
