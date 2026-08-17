import { col, Op } from 'sequelize';
import { centroMedicoModel } from '../../../models/centroMedico.model.js';
import { servicioCentroModel } from '../../../models/servicioCentro.model.js';
import { personaAdminModel } from '../../../models/personasAdmin.model.js';

export class ServicioCentroServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;
    search = search?.trim() || '';

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_servicio: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$centroMedico.nombre_centro$': {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await servicioCentroModel.findAndCountAll({
      attributes: [
        'id',
        'nombre_servicio',
        [col('centroMedico.nombre_centro'), 'nombre_centro'],
        'estado',
      ],
      include: [
        {
          model: centroMedicoModel,
          as: 'centroMedico',
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
    const data = await servicioCentroModel.findByPk(id);
    if (!data) {
      const err = new Error('No se encontro el servicio');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
  static async create(payload) {
    const { centro_medico_id, nombre_servicio, estado } = payload;
    const CentroMedicoSearch =
      await centroMedicoModel.findByPk(centro_medico_id);
    if (!CentroMedicoSearch) {
      const err = new Error('No se encontro el centro medico');
      err.statusCode = 404;
      throw err;
    }
    const nombreExist = await servicioCentroModel.findOne({
      where: {
        nombre_servicio,
      },
    });
    if (nombreExist) {
      const err = new Error('Ya existe un servicio con ese nombre');
      err.statusCode = 409;
      throw err;
    }

    const dateCreated = await servicioCentroModel.create({
      nombre_servicio,
      centro_medico_id,
      estado,
    });

    return dateCreated;
  }
  static async update(id, payload) {
    const { centro_medico_id, nombre_servicio, estado } = payload;
    const dataSearch = await servicioCentroModel.findByPk(id);

    if (!dataSearch) {
      const err = new Error('No se encontro el servicio centro');
      err.statusCode = 404;
      throw err;
    }

    let data = {};
    if (centro_medico_id) {
      const centroExist = await centroMedicoModel.findByPk(centro_medico_id);
      if (!centroExist) {
        const err = new Error('No se encontro el centro medico');
        err.statusCode = 404;
        throw err;
      }
      data.centro_medico_id = centro_medico_id;
    }
    if (nombre_servicio) {
      const nombreExist = await servicioCentroModel.findOne({
        where: {
          nombre_servicio,
        },
      });
      if (nombreExist) {
        const err = new Error('Ya existe un servicio con ese nombre');
        err.statusCode = 409;
        throw err;
      }
      data.nombre_servicio = nombre_servicio;
    }
    if (estado) {
      data.estado = estado;
    }
    await dataSearch.update(data);
    return dataSearch;
  }
  static async cambiarEstado(id) {
    const dataSearch = await servicioCentroModel.findByPk(id);

    if (!dataSearch) {
      const err = new Error('No se encontro el servicio centro');
      err.statusCode = 404;
      throw err;
    }
    const nuevoEstado = dataSearch.estado ? false : true;

    await dataSearch.update({ estado: nuevoEstado });
    return;
  }
  //

  static async getAllSelect(id_centro) {
    const centroSearch = await centroMedicoModel.findByPk(id_centro, {
      raw: true,
    });
    if (!centroSearch) {
      const err = new Error('No se encontro centro');
      err.statusCode = 404;
      throw err;
    }
    const serviciosSearch = await servicioCentroModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_servicio', 'label'],
      ],
      where: {
        centro_medico_id: centroSearch.id,
      },
    });
    if (!serviciosSearch) {
      const err = new Error('No se encontraron los servicios');
      err.statusCode = 404;
      throw err;
    }
    return serviciosSearch;
  }
}
