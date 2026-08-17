import { col, Op } from 'sequelize';
import { cargoInstitucionalModel } from '../../../models/cargoInstitucional.model.js';
import { areaTrabajoModel } from '../../../models/areaTrabajo.model.js';

export class CargoInstitucionalServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';
    let where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_cargo: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$areaTrabajo.nombre_area$': {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await cargoInstitucionalModel.findAndCountAll({
      attributes: [
        'id',
        'nombre_cargo',
        [col('areaTrabajo.nombre_area'), 'area_trabajo'],
      ],
      include: [
        {
          model: areaTrabajoModel,
          as: 'areaTrabajo',
          attributes: [],
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
    const cargoSearch = await cargoInstitucionalModel.findByPk(id);
    if (!cargoSearch) {
      const err = new Error('No se encontro el cargo institucional');
      err.statusCode = 404;
      throw err;
    }
    return cargoSearch;
  }
  static async create(payload) {
    const { nombre_cargo, area_trabajo_id } = payload;
    const nombreExist = await cargoInstitucionalModel.findOne({
      where: {
        nombre_cargo,
      },
    });
    if (nombreExist) {
      const err = new Error('Ya existe un cargo con cese nombre');
      err.statusCode = 409;
      throw err;
    }

    const areaExit = await areaTrabajoModel.findByPk(area_trabajo_id);
    if (!areaExit) {
      const err = new Error('No se encotro el area trabajo');
      err.statusCode = 404;
      throw err;
    }

    const cargoCreated = await cargoInstitucionalModel.create({
      nombre_cargo,
      area_trabajo_id,
    });
    return cargoCreated;
  }
  static async update(id, payload) {
    const { nombre_cargo, area_trabajo_id } = payload;

    const cargoSearch = await cargoInstitucionalModel.findByPk(id);

    if (!cargoSearch) {
      const err = new Error('No se encontro el cargo institucional');
      err.statusCode = 404;
      throw err;
    }

    let dataSave = {};
    if (nombre_cargo) {
      const nombreExist = await cargoInstitucionalModel.findOne({
        where: {
          nombre_cargo,
        },
      });
      if (nombreExist) {
        const err = new Error('Ya existe un cargo con cese nombre');
        err.statusCode = 409;
        throw err;
      }
      dataSave.nombre_cargo = nombre_cargo;
    }

    if (area_trabajo_id) {
      const areaExit = await areaTrabajoModel.findByPk(area_trabajo_id);
      if (!areaExit) {
        const err = new Error('No se encotro el area trabajo');
        err.statusCode = 404;
        throw err;
      }
      dataSave.area_trabajo_id = area_trabajo_id;
    }
    if (Object.keys(dataSave).length === 0) {
      const err = new Error('Debe enviar un valor minimamento para actualizar');
      err.statusCode = 409;
      throw err;
    }
    await cargoSearch.update(dataSave);
    return cargoSearch;
  }
  static async getSelect(id) {
    const AreaSearch = await areaTrabajoModel.findByPk(id);
    if (!AreaSearch) {
      const error = new Error('El área de trabajo no existe');
      error.statusCode = 404;
      throw error;
    }
    const data = await cargoInstitucionalModel.findAll({
      where: {
        area_trabajo_id: id,
      },
      attributes: [
        ['id', 'value'],
        ['nombre_cargo', 'label'],
      ],
    });
    return data;
  }
}
