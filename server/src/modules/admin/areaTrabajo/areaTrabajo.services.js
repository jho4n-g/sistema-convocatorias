import { Op } from 'sequelize';
import { areaTrabajoModel } from '../../../models/areaTrabajo.model.js';

export class AreaTrabajoServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';
    let where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_area: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await areaTrabajoModel.findAndCountAll({
      attributes: ['id', 'nombre_area'],
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
    const { nombre_area } = payload;
    const areaExirt = await areaTrabajoModel.findOne({
      where: { nombre_area },
    });
    if (areaExirt) {
      const err = new Error('Ya existe un area con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    const dataCreated = await areaTrabajoModel.create(payload);

    return dataCreated;
  }
  static async update(id, payload) {
    const { nombre_area } = payload;
    const areaSearch = await areaTrabajoModel.findByPk(id);
    if (!areaSearch) {
      const err = new Error('No existe el area');
      err.statusCode = 404;
      throw err;
    }
    const areaExirt = await areaTrabajoModel.findOne({
      where: { nombre_area },
    });
    if (areaExirt) {
      const err = new Error('Ya existe un area con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    await areaSearch.update({ nombre_area });

    return areaSearch;
  }
  static async getSelect() {
    const data = await areaTrabajoModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_area', 'label'],
      ],
    });
    return data;
  }
}
