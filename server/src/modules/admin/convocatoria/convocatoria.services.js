import { sequelize } from '../../../config/database.js';
import { convocatoriaModel } from '../../../models/convocatoria.model.js';
import { cargoInstitucionalModel } from '../../../models/cargoInstitucional.model.js';
import { experienciaGeneralModel } from '../../../models/experienciaGeneral.model.js';
import { servicioCentroModel } from '../../../models/servicioCentro.model.js';
//
import {
  areaTrabajoFormacionAcademicaModel,
  convocatoriaFormacionAcademicaModel,
  formacionAcademicaModel,
} from '../../../models/formacionAcademica.model.js';
import {
  convocatoriaExperienciaEspecificaModel,
  experienciaEspecifica,
} from '../../../models/experienciaEspecifica.model.js';
import { col, Op } from 'sequelize';
import { areaTrabajoModel } from '../../../models/areaTrabajo.model.js';
import { centroMedicoModel } from '../../../models/centroMedico.model.js';
import { convertirFechaATexto } from '../../../utils/funciones.js';
//****************************** */
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

//****************************** */

export class ConvocatoriaServices {
  static async getAll(page = 1, limit = 10, search = '', servicio_id = null) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';
    let where = {};

    if (servicio_id) {
      where.servicio_revisor_id = servicio_id;
    }

    if (search) {
      where[Op.or] = [
        // {
        //   nombre_cargo: {
        //     [Op.iLike]: `%${search}%`,
        //   },
        // },
        {
          '$cargoInstitucionalC.nombre_cargo$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$servicioCentroC.nombre_servicio$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$experienciaGeneralC.label$': {
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
        [col('servicioCentroC.nombre_servicio'), 'nombre_servicio'],
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
      attributes: {
        include: [[col('servicioCentroC.centroMedico.id'), 'centro_medico_id']],
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: servicioCentroModel,
          as: 'servicioCentroC',
          attributes: [],
          include: [
            {
              model: centroMedicoModel,
              as: 'centroMedico',
              attributes: [],
            },
          ],
        },
        {
          model: cargoInstitucionalModel,
          as: 'cargoInstitucionalC',
          attributes: [],
          include: [
            {
              model: areaTrabajoModel,
              as: 'areaTrabajo',
              attributes: [],
            },
          ],
        },
        {
          model: experienciaEspecifica,
          as: 'experienciasEspecificas',
          attributes: ['id'],
          through: {
            attributes: [],
          },
        },
        {
          model: areaTrabajoFormacionAcademicaModel,
          as: 'formacionesAcademicasC',
          include: [
            {
              model: areaTrabajoModel,
              as: 'areaTrabajoAFA',
            },
          ],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!dataId) {
      const err = new Error('No se encontró la convocatoria');
      err.statusCode = 404;
      throw err;
    }
    const data = dataId.toJSON();
    // return data;

    //*********************************************++ */
    //agregaro esto mas
    const formatDateOnly = (value) => {
      if (!value) return '';

      if (typeof value === 'string') {
        return value.substring(0, 10);
      }

      if (value instanceof Date) {
        return new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/La_Paz',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(value);
      }

      return '';
    };
    //*********************************************++ */

    return {
      ...data,
      area_trabajo_id:
        data.formacionesAcademicasC[0]?.areaTrabajoAFA?.id ?? null,

      fecha_publicacion: formatDateOnly(data.fecha_publicacion),

      fecha_cierre: formatDateOnly(data.fecha_cierre),

      experiencia_especifica_ids: data.experienciasEspecificas.map(
        (item) => item.id,
      ),

      formacion_academica_ids: data.formacionesAcademicasC.map(
        (item) => item.id,
      ),

      // Quitamos los arrays originales de objetos
      experienciasEspecificas: undefined,
      formacionesAcademicasC: undefined,
    };
  }
  static async create(payload) {
    return sequelize.transaction(async (t) => {
      const {
        cargo_institucional_id,
        experiencia_general_id,
        servicio_revisor_id,
        formacion_academica_ids = [],
        experiencia_especifica_ids = [],
        ...parent
      } = payload;

      const cargoInstExist = await cargoInstitucionalModel.findByPk(
        cargo_institucional_id,
        { transaction: t },
      );
      if (!cargoInstExist) {
        const err = new Error('No se econtro el cargo institucional');
        err.statusCode = 404;
        throw err;
      }
      const experienciaGeneralExist = await experienciaGeneralModel.findByPk(
        experiencia_general_id,
        { transaction: t },
      );

      if (!experienciaGeneralExist) {
        const err = new Error('No se econtro la experiencia general');
        err.statusCode = 404;
        throw err;
      }
      const servicioCentroExist = await servicioCentroModel.findByPk(
        servicio_revisor_id,
        { transaction: t },
      );
      if (!servicioCentroExist) {
        const err = new Error('No se econtro el servicio');
        err.statusCode = 404;
        throw err;
      }

      //Formacion academica
      const idsNormalizarFA = [...new Set(formacion_academica_ids.map(Number))];
      const EncontradosFASearch =
        await areaTrabajoFormacionAcademicaModel.findAll({
          where: {
            id: {
              [Op.in]: idsNormalizarFA,
            },
          },
          attributes: ['id'],
          raw: true,
          transaction: t,
        });

      const idsEncontradosFA = new Set(
        EncontradosFASearch.map((item) => item.id),
      );

      const idsNoEncontradosFA = idsNormalizarFA.filter(
        (id) => !idsEncontradosFA.has(id),
      );

      if (idsNoEncontradosFA.length > 0) {
        const err = new Error(
          `No existen las formaciones académicas con IDs: ${idsNoEncontradosFA.join(', ')}`,
        );
        err.statusCode = 404;
        throw err;
      }

      //experiencia especifica

      const idsNormalizarEE = [
        ...new Set(experiencia_especifica_ids.map(Number)),
      ];
      const EncontradosEESearch = await experienciaEspecifica.findAll({
        where: {
          id: {
            [Op.in]: idsNormalizarEE,
          },
        },
        attributes: ['id'],
        raw: true,
        transaction: t,
      });

      const idsEncontradosEE = new Set(
        EncontradosEESearch.map((item) => item.id),
      );

      const idsNoEncontradosEE = idsNormalizarEE.filter(
        (id) => !idsEncontradosEE.has(id),
      );

      if (idsNoEncontradosEE.length > 0) {
        const err = new Error(
          `No existen las experiencias especificas con IDs: ${idsNoEncontradosEE.join(', ')}`,
        );
        err.statusCode = 404;
        throw err;
      }
      //guardado de datos
      const convocatoriaCreated = await convocatoriaModel.create(
        {
          cargo_institucional_id,
          experiencia_general_id,
          servicio_revisor_id,
          ...parent,
        },
        { transaction: t },
      );

      const idsFA = idsNormalizarFA.map((id) => ({
        convocatoria_id: convocatoriaCreated.id,
        area_formacion_id: id,
      }));

      const idsEE = idsNormalizarEE.map((id) => ({
        convocatoria_id: convocatoriaCreated.id,
        experiencia_especifica_id: id,
      }));

      await convocatoriaFormacionAcademicaModel.bulkCreate(idsFA, {
        transaction: t,
      });
      await convocatoriaExperienciaEspecificaModel.bulkCreate(idsEE, {
        transaction: t,
      });

      const ConvocatoriaReload = await convocatoriaModel.findByPk(
        convocatoriaCreated.id,
        {
          include: [
            {
              model: cargoInstitucionalModel,
              as: 'cargoInstitucionalC',
            },
            {
              model: experienciaGeneralModel,
              as: 'experienciaGeneralC',
            },
            {
              model: servicioCentroModel,
              as: 'servicioCentroC',
            },
            {
              model: experienciaEspecifica,
              as: 'experienciasEspecificas',
              through: {
                attributes: [],
              },
            },
            {
              model: areaTrabajoFormacionAcademicaModel,
              as: 'formacionesAcademicasC',
              include: [
                {
                  model: areaTrabajoModel,
                  as: 'areaTrabajoAFA',
                },
                {
                  model: formacionAcademicaModel,
                  as: 'formacionAcademicaAFA',
                },
              ],
              through: {
                attributes: [],
              },
            },
          ],
          transaction: t,
        },
      );
      return ConvocatoriaReload;
    });
  }
  static async update(id, payload) {
    return sequelize.transaction(async (t) => {
      const {
        cargo_institucional_id,
        experiencia_general_id,
        servicio_revisor_id,
        titulo_cargo,
        cantidad_personal,
        objetivo_cargo,
        descripcion,
        estado,
        fecha_publicacion,
        fecha_cierre,
        formacion_academica_ids,
        experiencia_especifica_ids,
      } = payload;
      const dataSearch = await convocatoriaModel.findByPk(id, {
        transaction: t,
      });
      if (!dataSearch) {
        const err = new Error('No se encontro la convocatoria');
        err.statusCode = 404;
        throw err;
      }
      let data = {};

      if (cargo_institucional_id !== undefined) {
        const cargoInstExist = await cargoInstitucionalModel.findByPk(
          cargo_institucional_id,
          { transaction: t },
        );
        if (!cargoInstExist) {
          const err = new Error('No se econtro el cargo institucional');
          err.statusCode = 404;
          throw err;
        }
        data.cargo_institucional_id = cargo_institucional_id;
      }
      if (experiencia_general_id !== undefined) {
        const experienciaGeneralExist = await experienciaGeneralModel.findByPk(
          experiencia_general_id,
          { transaction: t },
        );

        if (!experienciaGeneralExist) {
          const err = new Error('No se econtro la experiencia general');
          err.statusCode = 404;
          throw err;
        }
        data.experiencia_general_id = experiencia_general_id;
      }
      if (servicio_revisor_id !== undefined) {
        const servicioCentroExist = await servicioCentroModel.findByPk(
          servicio_revisor_id,
          { transaction: t },
        );
        if (!servicioCentroExist) {
          const err = new Error('No se econtro el servicio');
          err.statusCode = 404;
          throw err;
        }
        data.servicio_revisor_id = servicio_revisor_id;
      }
      if (cantidad_personal !== undefined) {
        data.cantidad_personal = cantidad_personal;
      }
      if (objetivo_cargo !== undefined) {
        data.objetivo_cargo = objetivo_cargo;
      }
      if (descripcion !== undefined) {
        data.descripcion = descripcion;
      }
      if (estado !== undefined) {
        data.estado = estado;
      }
      if (fecha_publicacion !== undefined) {
        data.fecha_publicacion = fecha_publicacion;
      }
      if (fecha_cierre !== undefined) {
        data.fecha_cierre = fecha_cierre;
      }
      if (titulo_cargo !== undefined) {
        data.titulo_cargo = titulo_cargo;
      }

      /*
       * Validar formaciones académicas solamente si llegaron
       */
      let idsNormalizadosFA;

      if (formacion_academica_ids !== undefined) {
        if (!Array.isArray(formacion_academica_ids)) {
          const err = new Error(
            'Las formaciones académicas deben ser un array',
          );
          err.statusCode = 400;
          throw err;
        }

        idsNormalizadosFA = [...new Set(formacion_academica_ids.map(Number))];

        const idsInvalidos = idsNormalizadosFA.filter(
          (itemId) => !Number.isInteger(itemId) || itemId <= 0,
        );

        if (idsInvalidos.length > 0) {
          const err = new Error(
            `IDs de formación académica inválidos: ${idsInvalidos.join(', ')}`,
          );
          err.statusCode = 400;
          throw err;
        }

        const formacionesEncontradas =
          idsNormalizadosFA.length > 0
            ? await areaTrabajoFormacionAcademicaModel.findAll({
                where: {
                  id: {
                    [Op.in]: idsNormalizadosFA,
                  },
                },
                attributes: ['id'],
                raw: true,
                transaction: t,
              })
            : [];

        const idsEncontrados = new Set(
          formacionesEncontradas.map((item) => item.id),
        );

        const idsNoEncontrados = idsNormalizadosFA.filter(
          (itemId) => !idsEncontrados.has(itemId),
        );

        if (idsNoEncontrados.length > 0) {
          const err = new Error(
            `No existen las formaciones académicas con IDs: ${idsNoEncontrados.join(', ')}`,
          );
          err.statusCode = 404;
          throw err;
        }
      }

      /*
       * Validar experiencias específicas solamente si llegaron
       */
      let idsNormalizadosEE;

      if (experiencia_especifica_ids !== undefined) {
        if (!Array.isArray(experiencia_especifica_ids)) {
          const err = new Error(
            'Las experiencias específicas deben ser un array',
          );
          err.statusCode = 400;
          throw err;
        }

        idsNormalizadosEE = [
          ...new Set(experiencia_especifica_ids.map(Number)),
        ];

        const idsInvalidos = idsNormalizadosEE.filter(
          (itemId) => !Number.isInteger(itemId) || itemId <= 0,
        );

        if (idsInvalidos.length > 0) {
          const err = new Error(
            `IDs de experiencia específica inválidos: ${idsInvalidos.join(', ')}`,
          );
          err.statusCode = 400;
          throw err;
        }

        const experienciasEncontradas =
          idsNormalizadosEE.length > 0
            ? await experienciaEspecifica.findAll({
                where: {
                  id: {
                    [Op.in]: idsNormalizadosEE,
                  },
                },
                attributes: ['id'],
                raw: true,
                transaction: t,
              })
            : [];

        const idsEncontrados = new Set(
          experienciasEncontradas.map((item) => item.id),
        );

        const idsNoEncontrados = idsNormalizadosEE.filter(
          (itemId) => !idsEncontrados.has(itemId),
        );

        if (idsNoEncontrados.length > 0) {
          const err = new Error(
            `No existen las experiencias específicas con IDs: ${idsNoEncontrados.join(', ')}`,
          );
          err.statusCode = 404;
          throw err;
        }
      }

      /*
       * Actualizar datos principales
       */
      if (Object.keys(data).length > 0) {
        await dataSearch.update(data, {
          transaction: t,
        });
      }

      /*
       * Reemplazar formaciones académicas
       */
      if (idsNormalizadosFA !== undefined) {
        await convocatoriaFormacionAcademicaModel.destroy({
          where: {
            convocatoria_id: id,
          },
          transaction: t,
        });

        if (idsNormalizadosFA.length > 0) {
          const relacionesFA = idsNormalizadosFA.map((formacionId) => ({
            convocatoria_id: id,
            area_formacion_id: formacionId,
          }));

          await convocatoriaFormacionAcademicaModel.bulkCreate(relacionesFA, {
            transaction: t,
          });
        }
      }

      /*
       * Reemplazar experiencias específicas
       */
      if (idsNormalizadosEE !== undefined) {
        await convocatoriaExperienciaEspecificaModel.destroy({
          where: {
            convocatoria_id: id,
          },
          transaction: t,
        });

        if (idsNormalizadosEE.length > 0) {
          const relacionesEE = idsNormalizadosEE.map((experienciaId) => ({
            convocatoria_id: id,
            experiencia_especifica_id: experienciaId,
          }));

          await convocatoriaExperienciaEspecificaModel.bulkCreate(
            relacionesEE,
            { transaction: t },
          );
        }
      }
      const ConvocatoriaReload = await convocatoriaModel.findByPk(id, {
        include: [
          {
            model: cargoInstitucionalModel,
            as: 'cargoInstitucionalC',
          },
          {
            model: experienciaGeneralModel,
            as: 'experienciaGeneralC',
          },
          {
            model: servicioCentroModel,
            as: 'servicioCentroC',
          },
          {
            model: experienciaEspecifica,
            as: 'experienciasEspecificas',
            through: {
              attributes: [],
            },
          },
          {
            model: areaTrabajoFormacionAcademicaModel,
            as: 'formacionesAcademicasC',
            include: [
              {
                model: areaTrabajoModel,
                as: 'areaTrabajoAFA',
              },
              {
                model: formacionAcademicaModel,
                as: 'formacionAcademicaAFA',
              },
            ],
            through: {
              attributes: [],
            },
          },
        ],
        transaction: t,
      });
      return ConvocatoriaReload;
    });
  }

  //------------------------------------------------------------------
  //parche 18/08/2026

  static async getIdTitulo(id) {
    const dataId = await convocatoriaModel.findByPk(id, {
      attributes: [
        'titulo_cargo',
        [col('cargoInstitucionalC.nombre_cargo'), 'cargo_institucional'],
      ],
      include: [
        {
          model: cargoInstitucionalModel,
          as: 'cargoInstitucionalC',
          attributes: [],
        },
      ],
    });
    if (!dataId) {
      const err = new Error('No se encontró la convocatoria');
      err.statusCode = 404;
      throw err;
    }

    return dataId;
  }
}
