import fs from 'node:fs/promises';
import { personaModel } from '../../models/persona.model.js';
import { potulacionModel } from '../../models/postulacion.model.js';
import { DocumentoPostulacionFormacionAcademicaModel } from '../../models/documentoPostulacionFormacion.mode.js';
import {
  areaTrabajoFormacionAcademicaModel,
  convocatoriaFormacionAcademicaModel,
  formacionAcademicaModel,
} from '../../models/formacionAcademica.model.js';
import { col } from 'sequelize';
import { convocatoriaModel } from '../../models/convocatoria.model.js';
import { cargoInstitucionalModel } from '../../models/cargoInstitucional.model.js';
import { experienciaGeneralModel } from '../../models/experienciaGeneral.model.js';
import { experienciaEspecifica } from '../../models/experienciaEspecifica.model.js';
//Lo que se añadira al sistema 17-08-2026
import { formacionAcademicaPersonaModel } from '../../models/formacionAcademicaPersona.js';
import { nivelAcademicoModel } from '../../models/nivelAcademico.model.js';
import { experienciaLaboralModel } from '../../models/experienciaLaboral.model.js';
import { convertirFechaATexto } from '../../utils/funciones.js';
//persona_id colcar en la autentificacion

export class UsuarioServices {
  static async ListaDocumentos(id, persona_id) {
    const postulacionSearch = await potulacionModel.findOne({
      where: {
        id,
        persona_id,
      },
    });

    if (!postulacionSearch) {
      const err = new Error('No se encontro la postulacion');
      err.statusCode = 404;
      throw err;
    }
    const dataId = await convocatoriaModel.findByPk(
      postulacionSearch.convocatoria_id,
      {
        attributes: [
          [col('cargoInstitucionalC.nombre_cargo'), 'nombre_cargo'],
          [col('experienciaGeneralC.label'), 'experiencia_general'],
          'titulo_cargo',
          'cantidad_personal',
          'objetivo_cargo',
          'descripcion',
          'estado',
          'fecha_publicacion',
          'fecha_cierre',
        ],
        include: [
          {
            model: experienciaGeneralModel,
            as: 'experienciaGeneralC',
            attributes: [],
          },
          {
            model: cargoInstitucionalModel,
            as: 'cargoInstitucionalC',
            attributes: [],
          },
          {
            model: experienciaEspecifica,
            as: 'experienciasEspecificas',
            attributes: ['nombre_experiencia'],
            through: {
              attributes: [],
            },
          },
          // {
          //   model: areaTrabajoFormacionAcademicaModel,
          //   as: 'formacionesAcademicasC',
          //   attributes: ['id'],
          //   through: {
          //     attributes: [],
          //   },
          //   include: [
          //     {
          //       model: formacionAcademicaModel,
          //       as: 'formacionAcademicaAFA',
          //       attributes: ['nombre_formacion'],
          //     },
          //   ],
          // },
        ],
      },
    );

    const documetosUser =
      await DocumentoPostulacionFormacionAcademicaModel.findAll({
        where: {
          postulacion_id: postulacionSearch.id,
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

    //Lo que se añadira al sistema 17-08-2026
    const formacionAcademicaPersonaSearch =
      await formacionAcademicaPersonaModel.findAll({
        where: { persona_id },
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
      where: { persona_id },
      attributes: ['cargo_puesto', 'empresa_institucion', 'area', 'gestion'],
    });

    const dataIdNorm = {
      ...dataId.toJSON(),
      fecha_publicacion: convertirFechaATexto(dataId?.fecha_publicacion),
      fecha_cierre: convertirFechaATexto(dataId?.fecha_cierre),
    };

    const personaSearch = await personaModel.findByPk(persona_id, {
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
    });

    if (!personaSearch) {
      const err = new Error('No se encontro a la persona');
      err.statusCode = 404;
      throw err;
    }

    const personaNorm = {
      ...personaSearch.toJSON(),
      fecha_nacimiento: convertirFechaATexto(personaSearch?.fecha_nacimiento),
    };
    return {
      documentos: documetosUser,
      persona: personaNorm,
      formacionAcademica: formacionAcademicaPersonaSearch,
      experienciaLaboral: experienciaLaboralSearch,
      data: dataIdNorm,
    };
  }
  static async listaPostulaciones(id) {
    const postulacionSearch = await potulacionModel.findAll({
      // subQuery: false,
      attributes: [
        'id',
        'estado',
        [col('convocatoriaPostulantes.titulo_cargo'), 'titulo_cargo'],
        [
          col('convocatoriaPostulantes.cargoInstitucionalC.nombre_cargo'),
          'nombre_cargo',
        ],
        // [
        //   col('convocatoriaPostulantes.experienciaGeneralC.label'),
        //   'experiencia_general',
        // ],
      ],
      where: {
        persona_id: id,
      },
      include: [
        {
          model: convocatoriaModel,
          as: 'convocatoriaPostulantes',
          attributes: [],
          include: [
            {
              model: cargoInstitucionalModel,
              as: 'cargoInstitucionalC',
              attributes: [],
            },
            {
              model: experienciaGeneralModel,
              as: 'experienciaGeneralC',
              attributes: [],
            },
            // {
            //   model: experienciaEspecifica,
            //   as: 'experienciasEspecificas',
            //   through: { attributes: [] },
            // },
          ],
        },
      ],
    });
    if (!postulacionSearch) {
      const err = new Error('No se encontro postulacione');
      err.statusCode = 404;
      throw err;
    }
    return postulacionSearch;
  }
  static async obtenerDocumento(id) {
    const documento =
      await DocumentoPostulacionFormacionAcademicaModel.findByPk(id, {
        raw: true,
      });
    if (!documento) {
      const error = new Error('Documento no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Opcional, pero recomendable:
    // comprobar que el archivo realmente exista físicamente
    try {
      await fs.access(documento.path);
    } catch {
      const error = new Error('El archivo no existe en el servidor');
      error.statusCode = 404;
      throw error;
    }
    return documento;
  }
}
