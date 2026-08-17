import { Op } from 'sequelize';
import { nivelAcademicoModel } from '../../../models/nivelAcademico.model.js';

export class NivelAcademicoServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await nivelAcademicoModel.findAndCountAll({
      attributes: ['id', 'nombre'],
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
    const { nombre } = payload;

    const nombreExist = await nivelAcademicoModel.findOne({
      where: {
        nombre,
      },
    });
    if (nombreExist) {
      const err = new Error('Ya existe un nivel academico con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    const data = await nivelAcademicoModel.create({
      nombre,
    });
    return data;
  }
  static async update(id, payload) {
    const { nombre } = payload;
    const centroSearch = await nivelAcademicoModel.findByPk(id);
    if (!centroSearch) {
      const err = new Error('No existe el nivel academico');
      err.statusCode = 404;
      throw err;
    }
    const nombreExist = await nivelAcademicoModel.findOne({
      where: {
        nombre,
      },
    });
    if (nombreExist) {
      const err = new Error('Ya existe un nivel academico con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    await centroSearch.update({ nombre });
    return centroSearch;
  }
  static async getAllSelect() {
    const data = await nivelAcademicoModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre', 'label'],
      ],
    });

    return data;
  }
}
