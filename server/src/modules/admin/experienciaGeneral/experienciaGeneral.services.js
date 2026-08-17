import { Op, Sequelize } from 'sequelize';
import { experienciaGeneralModel } from '../../../models/experienciaGeneral.model.js';

export class ExperienciaGeneralServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';
    let where = {};

    if (search) {
      where[Op.or] = [
        {
          label: {
            [Op.iLike]: `%${search}%`,
          },
        },
        Sequelize.where(
          Sequelize.cast(Sequelize.col('meses_experiencia'), 'TEXT'),
          {
            [Op.iLike]: `%${search}%`,
          },
        ),
      ];
    }

    const { count, rows } = await experienciaGeneralModel.findAndCountAll({
      attributes: ['id', 'label', 'meses_experiencia'],
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
  static async create(payload) {
    const { meses_experiencia, label } = payload;
    const experienciaExiste = await experienciaGeneralModel.findOne({
      where: {
        [Op.or]: [
          {
            label: {
              [Op.iLike]: label.trim(),
            },
          },
          {
            meses_experiencia: Number(meses_experiencia),
          },
        ],
      },
    });
    if (experienciaExiste) {
      const error = new Error(
        'Ya existe una experiencia general con ese nombre o cantidad de meses',
      );
      error.statusCode = 409;
      throw error;
    }
    const dataCreated = await experienciaGeneralModel.create(payload);

    return dataCreated;
  }
  static async update(id, payload) {
    const experiencia = await experienciaGeneralModel.findByPk(id);

    if (!experiencia) {
      const err = new Error('No existe la experiencia general');
      err.statusCode = 404;
      throw err;
    }

    const dataUpdate = {};

    if (payload.label !== undefined) {
      dataUpdate.label = payload.label.trim();
    }

    if (payload.meses_experiencia !== undefined) {
      dataUpdate.meses_experiencia = Number(payload.meses_experiencia);
    }

    if (Object.keys(dataUpdate).length === 0) {
      const err = new Error('No se enviaron campos para actualizar');
      err.statusCode = 400;
      throw err;
    }

    const condicionesDuplicado = [];

    if (dataUpdate.label !== undefined) {
      condicionesDuplicado.push({
        label: {
          [Op.iLike]: dataUpdate.label,
        },
      });
    }

    if (dataUpdate.meses_experiencia !== undefined) {
      condicionesDuplicado.push({
        meses_experiencia: dataUpdate.meses_experiencia,
      });
    }

    const experienciaDuplicada = await experienciaGeneralModel.findOne({
      where: {
        id: {
          [Op.ne]: id,
        },
        [Op.or]: condicionesDuplicado,
      },
    });

    if (experienciaDuplicada) {
      const labelRepetido =
        dataUpdate.label !== undefined &&
        experienciaDuplicada.label.toLowerCase() ===
          dataUpdate.label.toLowerCase();

      const mesesRepetidos =
        dataUpdate.meses_experiencia !== undefined &&
        experienciaDuplicada.meses_experiencia === dataUpdate.meses_experiencia;

      const err = new Error(
        labelRepetido && mesesRepetidos
          ? 'Ya existe una experiencia con el mismo nombre y cantidad de meses'
          : labelRepetido
            ? 'Ya existe una experiencia general con ese nombre'
            : 'Ya existe una experiencia general con esa cantidad de meses',
      );

      err.statusCode = 409;
      throw err;
    }

    await experiencia.update(dataUpdate);

    return experiencia;
  }
  static async getSelect() {
    const data = await experienciaGeneralModel.findAll({
      attributes: [['id', 'value'], 'label'],
    });
    return data;
  }
}
