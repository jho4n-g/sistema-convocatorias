import { Op } from 'sequelize';
import { centroMedicoModel } from '../../../models/centroMedico.model.js';

export class CentroMedicoServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_centro: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await centroMedicoModel.findAndCountAll({
      attributes: ['id', 'nombre_centro'],
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
    const { nombre_centro } = payload;

    const nombreExist = await centroMedicoModel.findOne({
      where: {
        nombre_centro,
      },
    });
    if (nombreExist) {
      const err = new Error('Ya existe un centro medico con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    const data = await centroMedicoModel.create({
      nombre_centro,
    });
    return data;
  }
  static async update(id, payload) {
    const { nombre_centro } = payload;
    const centroSearch = await centroMedicoModel.findByPk(id);
    if (!centroSearch) {
      const err = new Error('No existe el centro medico');
      err.statusCode = 404;
      throw err;
    }
    const nombreExist = await centroMedicoModel.findOne({
      where: {
        nombre_centro,
      },
    });
    if (nombreExist) {
      const err = new Error('Ya existe un centro medico con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    await centroSearch.update({ nombre_centro });
    return centroSearch;
  }
  static async getAllSelect() {
    const data = await centroMedicoModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_centro', 'label'],
      ],
    });

    return data;
  }
}
