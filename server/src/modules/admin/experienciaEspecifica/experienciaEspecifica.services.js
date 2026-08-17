import { Op } from 'sequelize';
import { experienciaEspecifica } from '../../../models/experienciaEspecifica.model.js';

export class experienciaEspecificaServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';
    let where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_experiencia: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await experienciaEspecifica.findAndCountAll({
      attributes: ['id', 'nombre_experiencia'],
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
    const { nombre_experiencia } = payload;
    const areaExirt = await experienciaEspecifica.findOne({
      where: { nombre_experiencia },
    });
    if (areaExirt) {
      const err = new Error(
        'Ya existe una experiencia especifica con esos datos',
      );
      err.statusCode = 409;
      throw err;
    }
    const dataCreated = await experienciaEspecifica.create(payload);

    return dataCreated;
  }
  static async update(id, payload) {
    const { nombre_experiencia } = payload;
    const areaSearch = await experienciaEspecifica.findByPk(id);
    if (!areaSearch) {
      const err = new Error('No existe la experiencia especifica');
      err.statusCode = 404;
      throw err;
    }
    const areaExirt = await experienciaEspecifica.findOne({
      where: { nombre_experiencia },
    });
    if (areaExirt) {
      const err = new Error(
        'Ya existe una experiencia especifica con esos datos',
      );
      err.statusCode = 409;
      throw err;
    }
    await areaSearch.update({ nombre_experiencia });

    return areaSearch;
  }
  static async getSelect() {
    const data = await experienciaEspecifica.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_experiencia', 'label'],
      ],
    });
    return data;
  }
}
