import { Op, col } from 'sequelize';
import {
  formacionAcademicaModel,
  areaTrabajoFormacionAcademicaModel,
  convocatoriaFormacionAcademicaModel,
} from '../../../models/formacionAcademica.model.js';
import { areaTrabajoModel } from '../../../models/areaTrabajo.model.js';
import { sequelize } from '../../../config/database.js';

export class FormacionAcademicaServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';
    let where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_formacion: {
            [Op.iLike]: `%${search}%`,
          },
        },
        // {
        //   '$areaTrabajoFA.nombre_area$': {
        //     [Op.iLike]: `%${search}%`,
        //   },
        // },
      ];
    }

    const { count, rows } = await formacionAcademicaModel.findAndCountAll({
      attributes: ['id', 'nombre_formacion'],
      include: [
        {
          model: areaTrabajoModel,
          as: 'areasTrabajosFA',
          attributes: ['nombre_area'],
          through: {
            attributes: [],
          },
        },
      ],
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
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
    const dataId = await formacionAcademicaModel.findByPk(id, {
      attributes: { exclude: ['updatedAt', 'createdAt'] },
      include: [
        {
          model: areaTrabajoModel,
          as: 'areasTrabajosFA',
          attributes: ['id'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!dataId) {
      const err = new Error('No se encontro la formaicon academica');
      err.statusCode = 404;
      throw err;
    }
    const dataNormalizado = {
      ...dataId.toJSON(),
      area_trabajo_ids: Array.isArray(dataId?.areasTrabajosFA)
        ? dataId?.areasTrabajosFA?.map((row) => row.id)
        : [],
    };
    delete dataNormalizado?.areasTrabajosFA;
    return dataNormalizado;
  }
  static async create(payload) {
    return sequelize.transaction(async (t) => {
      const { nombre_formacion, area_trabajo_ids } = payload;

      const idsNormalizarAT = [...new Set(area_trabajo_ids.map(Number))];

      const EncontradosATSearch = await areaTrabajoModel.findAll({
        where: {
          id: {
            [Op.in]: idsNormalizarAT,
          },
        },
        attributes: ['id'],
        raw: true,
        transaction: t,
      });

      const idsEncontradosAT = new Set(
        EncontradosATSearch.map((item) => item.id),
      );

      const idsNoEncontradosAT = idsNormalizarAT.filter(
        (id) => !idsEncontradosAT.has(id),
      );

      if (idsNoEncontradosAT.length > 0) {
        const err = new Error(
          `No existen las formaciones academicas con IDs: ${idsNoEncontradosAT.join(', ')}`,
        );
        err.statusCode = 404;
        throw err;
      }
      //

      const arrayIdsEcontrados = [...idsEncontradosAT];

      const dobleNombreExist = await formacionAcademicaModel.findOne({
        where: {
          nombre_formacion: nombre_formacion,
        },
        transaction: t,
      });
      if (dobleNombreExist) {
        const err = new Error(
          `Ya existe una formación académica con el nombre: ${nombre_formacion}`,
        );
        err.statusCode = 409;
        throw err;
      }
      const dataCreated = await formacionAcademicaModel.create(payload);

      //
      const idsAT = arrayIdsEcontrados.map((id) => ({
        area_trabajo_id: id,
        formacion_academica_id: dataCreated.id,
      }));

      await areaTrabajoFormacionAcademicaModel.bulkCreate(idsAT, {
        transaction: t,
      });

      const dataReload = await formacionAcademicaModel.findByPk(
        dataCreated.id,
        {
          include: [
            {
              model: areaTrabajoModel,
              as: 'areasTrabajosFA',
              through: {
                attributes: [],
              },
            },
          ],
          transaction: t,
        },
      );

      return dataReload;
    });
  }
  static async update(id, payload) {
    return sequelize.transaction(async (t) => {
      const { area_trabajo_ids = [], nombre_formacion } = payload;
      const dataSearch = await formacionAcademicaModel.findByPk(id, {
        transaction: t,
      });
      if (!dataSearch) {
        const err = new Error('No se encontro la formaicon academica');
        err.statusCode = 404;
        throw err;
      }

      if (area_trabajo_ids !== undefined) {
        if (!Array.isArray(area_trabajo_ids)) {
          const err = new Error(
            'Las áreas de trabajo deben enviarse en un arreglo',
          );
          err.statusCode = 400;
          throw err;
        }

        const idsNormalizadosAT = [
          ...new Set(
            area_trabajo_ids
              .map(Number)
              .filter((id) => Number.isInteger(id) && id > 0),
          ),
        ];

        /* =====================================================
     1. Verificar que todas las áreas solicitadas existan
  ===================================================== */

        let areasEncontradas = [];

        if (idsNormalizadosAT.length > 0) {
          areasEncontradas = await areaTrabajoModel.findAll({
            where: {
              id: {
                [Op.in]: idsNormalizadosAT,
              },
            },
            attributes: ['id'],
            raw: true,
            transaction: t,
          });
        }

        const idsAreasEncontradas = new Set(
          areasEncontradas.map((item) => Number(item.id)),
        );

        const idsNoEncontrados = idsNormalizadosAT.filter(
          (id) => !idsAreasEncontradas.has(id),
        );

        if (idsNoEncontrados.length > 0) {
          const err = new Error(
            `No existen las áreas de trabajo con IDs: ${idsNoEncontrados.join(', ')}`,
          );
          err.statusCode = 404;
          throw err;
        }

        /* =====================================================
     2. Obtener las relaciones que existen actualmente
  ===================================================== */

        const relacionesActuales =
          await areaTrabajoFormacionAcademicaModel.findAll({
            where: {
              formacion_academica_id: dataSearch.id,
            },
            attributes: ['id', 'area_trabajo_id', 'formacion_academica_id'],
            raw: true,
            transaction: t,
          });

        const idsAreasActuales = new Set(
          relacionesActuales.map((item) => Number(item.area_trabajo_id)),
        );

        const idsAreasSolicitadas = new Set(idsNormalizadosAT);

        /* =====================================================
     3. Relaciones que deben eliminarse
  ===================================================== */

        const relacionesAEliminar = relacionesActuales.filter(
          (relacion) =>
            !idsAreasSolicitadas.has(Number(relacion.area_trabajo_id)),
        );

        const idsRelacionesAEliminar = relacionesAEliminar.map(
          (relacion) => relacion.id,
        );

        /* =====================================================
     4. Verificar si las relaciones a eliminar son usadas
        por alguna convocatoria
  ===================================================== */

        if (idsRelacionesAEliminar.length > 0) {
          const relacionUtilizada =
            await convocatoriaFormacionAcademicaModel.findOne({
              where: {
                area_formacion_id: {
                  [Op.in]: idsRelacionesAEliminar,
                },
              },
              attributes: ['id', 'convocatoria_id', 'area_formacion_id'],
              raw: true,
              transaction: t,
            });

          if (relacionUtilizada) {
            const areasNoEliminables = relacionesAEliminar
              .map((item) => item.area_trabajo_id)
              .join(', ');

            const err = new Error(
              `No se pueden quitar las áreas, porque están siendo utilizadas en una convocatoria`,
            );

            err.statusCode = 409;
            throw err;
          }
        }

        /* =====================================================
     5. Áreas nuevas que deben agregarse
  ===================================================== */

        const idsAreasAAgregar = idsNormalizadosAT.filter(
          (areaId) => !idsAreasActuales.has(areaId),
        );

        /* =====================================================
     6. Eliminar solamente las relaciones retiradas
  ===================================================== */

        if (idsRelacionesAEliminar.length > 0) {
          await areaTrabajoFormacionAcademicaModel.destroy({
            where: {
              id: {
                [Op.in]: idsRelacionesAEliminar,
              },
            },
            transaction: t,
          });
        }

        /* =====================================================
     7. Crear solamente las relaciones nuevas
  ===================================================== */

        if (idsAreasAAgregar.length > 0) {
          const nuevasRelaciones = idsAreasAAgregar.map((areaId) => ({
            area_trabajo_id: areaId,
            formacion_academica_id: dataSearch.id,
          }));

          await areaTrabajoFormacionAcademicaModel.bulkCreate(
            nuevasRelaciones,
            {
              transaction: t,
            },
          );
        }
      }
      if (nombre_formacion) {
        const dobleNombreExist = await formacionAcademicaModel.findOne({
          where: {
            nombre_formacion: nombre_formacion,
          },
          transaction: t,
        });

        if (dobleNombreExist) {
          const err = new Error(
            'Ya existe una formacion academica con ese nombre',
          );
          err.statusCode = 409;
          throw err;
        }
        await dataSearch.update({ nombre_formacion }, { transaction: t });
      }
      if (nombre_formacion && area_trabajo_ids === 0) {
        const err = new Error(
          'Debe enviar un valor minimamento para actualizar',
        );
        err.statusCode = 409;
        throw err;
      }

      const dataReload = await formacionAcademicaModel.findByPk(id, {
        include: [
          {
            model: areaTrabajoModel,
            as: 'areasTrabajosFA',
            through: {
              attributes: [],
            },
          },
        ],
        transaction: t,
      });
      return dataReload;
    });
  }
  static async getSelect(id) {
    const areaSearch = await areaTrabajoModel.findByPk(id);
    if (!areaSearch) {
      const err = new Error('No se encontro el area de trabajo');
      err.statusCode = 404;
      throw err;
    }
    const data = await areaTrabajoFormacionAcademicaModel.findAll({
      attributes: [
        ['id', 'value'],
        [col('formacionAcademicaAFA.nombre_formacion'), 'label'],
      ],
      include: [
        {
          model: areaTrabajoModel,
          as: 'areaTrabajoAFA',
          attributes: [],
          where: {
            id: id,
          },
        },
        {
          model: formacionAcademicaModel,
          as: 'formacionAcademicaAFA',
          attributes: [],
        },
      ],
    });
    return data;
  }
}
