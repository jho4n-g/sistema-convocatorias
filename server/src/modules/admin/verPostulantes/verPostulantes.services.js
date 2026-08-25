import { Op, col, fn, where as sequelizeWhere, literal } from 'sequelize';
import { convocatoriaModel } from '../../../models/convocatoria.model.js';
import { potulacionModel } from '../../../models/postulacion.model.js';
import { personaModel } from '../../../models/persona.model.js';
import { formacionAcademicaPersonaModel } from '../../../models/formacionAcademicaPersona.js';
import { experienciaLaboralModel } from '../../../models/experienciaLaboral.model.js';
import { DocumentoPostulacionFormacionAcademicaModel } from '../../../models/documentoPostulacionFormacion.mode.js';
import {
  areaTrabajoFormacionAcademicaModel,
  convocatoriaFormacionAcademicaModel,
  formacionAcademicaModel,
} from '../../../models/formacionAcademica.model.js';
import { nivelAcademicoModel } from '../../../models/nivelAcademico.model.js';

export class VerPostulantesServices {
  static async getAll(id, page = 1, limit = 10, search = '') {
    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const convocatoriaSearch = await convocatoriaModel.findByPk(id);

    if (!convocatoriaSearch) {
      const err = new Error('No se encontró la convocatoria');
      err.statusCode = 404;
      throw err;
    }

    const where = {
      convocatoria_id: convocatoriaSearch.id,
    };

    if (search) {
      where[Op.or] = [
        {
          '$personaPostulacion.cedula_identidad$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$personaPostulacion.nombres$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$personaPostulacion.apellido_paterno$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$personaPostulacion.apellido_materno$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$personaPostulacion.correo$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        sequelizeWhere(
          fn(
            'concat_ws',
            ' ',
            col('personaPostulacion.nombres'),
            col('personaPostulacion.apellido_paterno'),
            col('personaPostulacion.apellido_materno'),
          ),
          {
            [Op.iLike]: `%${search}%`,
          },
        ),
      ];
    }

    const { count, rows } = await potulacionModel.findAndCountAll({
      attributes: [
        'id',
        [col('personaPostulacion.cedula_identidad'), 'cedula_identidad'],
        [col('personaPostulacion.nombres'), 'nombres'],
        [col('personaPostulacion.apellido_paterno'), 'apellido_paterno'],
        [col('personaPostulacion.apellido_materno'), 'apellido_materno'],
        [col('personaPostulacion.correo'), 'correo'],
        [col('personaPostulacion.numero_celular'), 'numero_celular'],
        'estado',
      ],

      where,

      include: [
        {
          model: personaModel,
          as: 'personaPostulacion',
          attributes: [],
          required: true,
        },
      ],

      limit,
      offset,
      //aumente esto aumentar literal
      order: [
        [
          literal(`
        CASE
          WHEN estado = 'ENVIADO' THEN 1
          WHEN estado = 'OBSERVADO' THEN 2
          WHEN estado = 'APROBADO' THEN 3
          ELSE 4
        END
      `),
          'ASC',
        ],
        ['id', 'DESC'],
      ],
      //aumente esto
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async getId(id) {
    const postulanteSearch = await potulacionModel.findByPk(id);
    if (!postulanteSearch) {
      const err = new Error('No se encontro postulante');
      err.statusCode = 404;
      throw err;
    }
    const personaSearch = await personaModel.findByPk(
      postulanteSearch.persona_id,
      {
        attributes: {
          include: [
            [
              col('postulacionesPersonas.trabajo_anteriormente_institucion'),
              'trabajo_anteriormente_institucion',
            ],
          ],
          exclude: ['createdAt', 'updatedAt', 'usuario_id', 'id'],
        },
        include: [
          {
            model: potulacionModel,
            as: 'postulacionesPersonas',
            attributes: [],
          },
        ],
      },
    );
    const formacionAcademicaPersonaSearch =
      await formacionAcademicaPersonaModel.findAll({
        where: { persona_id: postulanteSearch.persona_id },
        attributes: [
          'estado',
          'titulo',
          'institucion',
          [col('nivelAcademico.nombre'), 'nivel_academico'],
        ],
        include: [
          {
            model: nivelAcademicoModel,
            as: 'nivelAcademico',
            attributes: [],
          },
        ],
      });

    const experienciaLaboralSearch = await experienciaLaboralModel.findAll({
      where: { persona_id: postulanteSearch.persona_id },
      attributes: ['cargo_puesto', 'empresa_institucion', 'area', 'gestion'],
    });
    const documetosUser =
      await DocumentoPostulacionFormacionAcademicaModel.findAll({
        where: {
          postulacion_id: postulanteSearch.id,
        },
        attributes: {
          exclude: [
            'updatedAt',
            'createdAt',
            'convocatoria_formacion_di',
            'postulacion_id',
            'path',
          ],
          include: [
            [
              col(
                'convocatoriaDocumento.areasTrabajoFormacion.formacionAcademicaAFA.nombre_formacion',
              ),
              'nombre_formacion',
            ],
          ],
        },
        include: [
          {
            model: convocatoriaFormacionAcademicaModel,
            as: 'convocatoriaDocumento',
            attributes: [],
            include: [
              {
                model: areaTrabajoFormacionAcademicaModel,
                as: 'areasTrabajoFormacion',
                attributes: [],
                include: [
                  {
                    model: formacionAcademicaModel,
                    as: 'formacionAcademicaAFA',
                    attributes: [],
                  },
                ],
              },
            ],
          },
        ],
      });

    return {
      persona: personaSearch,
      formacionAcademica: formacionAcademicaPersonaSearch,
      experienciaLaboral: experienciaLaboralSearch,
      documentos: documetosUser,
    };
  }
  //agregar litelral
  static async revisar(id, payload) {
    const postulacionSearch = await potulacionModel.findByPk(id);
    if (!postulacionSearch) {
      const err = new Error('No se econtro postulante');
      err.statusCode = 404;
      throw err;
    }
    const { estado } = payload;

    const valoresPermitidos = ['APROBADO', 'OBSERVADO'];

    if (!valoresPermitidos.includes(estado)) {
      const error = new Error(
        `Estado inválido. Valores permitidos: ${valoresPermitidos.join(', ')}`,
      );
      error.status = 400;
      throw error;
    }

    await postulacionSearch.update({ estado });
    return;
  }
}
