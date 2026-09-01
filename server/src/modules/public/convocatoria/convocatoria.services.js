import { convocatoriaModel } from '../../../models/convocatoria.model.js';
import { cargoInstitucionalModel } from '../../../models/cargoInstitucional.model.js';
import { experienciaGeneralModel } from '../../../models/experienciaGeneral.model.js';
import { servicioCentroModel } from '../../../models/servicioCentro.model.js';
import { convertirFechaATexto } from '../../../utils/funciones.js';
//
import {
  areaTrabajoFormacionAcademicaModel,
  formacionAcademicaModel,
  convocatoriaFormacionAcademicaModel,
} from '../../../models/formacionAcademica.model.js';
import { experienciaEspecifica } from '../../../models/experienciaEspecifica.model.js';
import { col, Op } from 'sequelize';

const formatDateOnlyText = (value) => {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);

  const fecha = new Intl.DateTimeFormat('es-BO', {
    timeZone: 'America/La_Paz',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};
export class ConvocatoriaServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';
    let where = {
      estado: 'PUBLICADO',
    };

    if (search) {
      where[Op.or] = [
        {
          titulo_cargo: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$cargoInstitucionalC.nombre_cargo$': {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }
    const { count, rows } = await convocatoriaModel.findAndCountAll({
      attributes: [
        'id',
        [col('cargoInstitucionalC.nombre_cargo'), 'nombre_cargo'],
        [col('experienciaGeneralC.label'), 'experiencia_general'],
        'titulo_cargo',
        'objetivo_cargo',
        'descripcion',
        'estado',
        'fecha_publicacion',
        'fecha_cierre',
      ],
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
        {
          model: servicioCentroModel,
          as: 'servicioCentroC',
          attributes: [],
        },
      ],
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    const dataNomr = rows.map((row) => ({
      ...row.toJSON(),
      fecha_publicacion: formatDateOnlyText(row.fecha_publicacion),
      fecha_cierre: formatDateOnlyText(row.fecha_cierre),
    }));
    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: dataNomr,
    };
  }
  static async getId(id) {
    const dataId = await convocatoriaModel.findByPk(id, {
      attributes: [
        [col('cargoInstitucionalC.nombre_cargo'), 'nombre_cargo'],
        [col('experienciaGeneralC.label'), 'experiencia_general'],
        'titulo_cargo',
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
        {
          model: areaTrabajoFormacionAcademicaModel,
          as: 'formacionesAcademicasC',
          attributes: ['id'],
          through: {
            attributes: [],
          },
          include: [
            {
              model: formacionAcademicaModel,
              as: 'formacionAcademicaAFA',
              attributes: ['nombre_formacion'],
            },
          ],
        },
      ],
    });
    if (!dataId) {
      const err = new Error('No se encontró la convocatoria');
      err.statusCode = 404;
      throw err;
    }

    const result = dataId.toJSON();

    result.formacionesAcademicasC = result.formacionesAcademicasC.map(
      (item) => ({
        id: item.id,
        nombre_formacion: item.formacionAcademicaAFA?.nombre_formacion ?? null,
      }),
    );

    result.fecha_publicacion = formatDateOnlyText(result.fecha_publicacion);
    result.fecha_cierre = formatDateOnlyText(result.fecha_cierre);

    return result;
  }
  static async getDocuments(id) {
    const convocatoriaSearch = await convocatoriaModel.findByPk(id);
    if (!convocatoriaSearch) {
      const err = new Error('No se encontro convocatorias');
      err.statusCode = 404;
      throw err;
    }
    const convocatoriaFormacion =
      await convocatoriaFormacionAcademicaModel.findAll({
        attributes: [
          'id',
          [
            col('areasTrabajoFormacion.formacionAcademicaAFA.nombre_formacion'),
            'nombre_formacion',
          ],
        ],
        where: {
          convocatoria_id: id,
        },
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
      });

    return convocatoriaFormacion;
    const arrayIds = convocatoriaFormacion.map((row) => row.area_formacion_id);

    const documentos = await areaTrabajoFormacionAcademicaModel.findAll({
      attributes: [
        'id',
        [col('formacionAcademicaAFA.nombre_formacion'), 'nombre_formacion'],
      ],
      where: {
        id: {
          [Op.in]: arrayIds,
        },
      },
      include: [
        {
          model: formacionAcademicaModel,
          as: 'formacionAcademicaAFA',
          attributes: [],
        },
      ],
    });
    return documentos;
  }
}
