import { col, Op } from 'sequelize';
import { ConvocatoriaModel } from '../../../models/convocatoria/convocatorio.model.js';
import { servicioCentroModel } from '../../../models/servicioCentro.model.js';

export class ConvocatoriaServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;
    search = search?.trim() || '';

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          titulo: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          cargo: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          area: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await ConvocatoriaModel.findAndCountAll({
      attributes: [
        'titulo',
        'cargo',
        'area',
        'cantidad_personal',
        'experiencia_minima',
        'nivel_academico',
        'objetivo_cargo',
        'descripcion',
        'estado',
        'fecha_inicio',
        'fecha_final',
        [col('servicioConvocatoria.nombre_servicio'), 'nombre_servicio'],
      ],
      include: [
        {
          model: servicioCentroModel,
          as: 'servicioConvocatoria',
          attributes: [],
        },
      ],
      where,
      limit,
      offset,
      // Importante al buscar en tablas relacionadas
      subQuery: false,
      distinct: true,
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
    const convocatoriaSearch = await ConvocatoriaModel.findByPk(id);
    if (!convocatoriaSearch) {
      const err = new Error('No se encotro la convocatoria');
      err.statusCode = 404;
      throw err;
    }
    return convocatoriaSearch;
  }
  static async create(payload) {
    const { servicio_id, ...parent } = payload;
    const servicioSearch = await servicioCentroModel.findByPk(servicio_id);
    if (!servicioSearch) {
      const err = new Error('No se encotro el servicio');
      err.statusCode = 404;
      throw err;
    }
    const created = await ConvocatoriaModel.create(payload);
    return created;
  }
  static async update(id, payload) {
    const {
      servicio_id,
      cargo,
      area,
      cantidad_personal,
      experiencia_minima,
      nivel_academico,
      objetivo_cargo,
      descripcion,
      fecha_inicio,
      fecha_final,
    } = payload;

    const convocatoriaSearch = await ConvocatoriaModel.findByPk(id);
    if (!convocatoriaSearch) {
      const err = new Error('No se encotro la convocatoria');
      err.statusCode = 404;
      throw err;
    }

    if (convocatoriaSearch.estado === 'EN_REVISION') {
      const err = new Error('No se puede editar porque esta en revision');
      err.statusCode = 409;
      throw err;
    }
    let data = {};
    if (servicio_id) {
      const servicioSearch = await servicioCentroModel.findByPk(servicio_id);
      if (!servicioSearch) {
        const err = new Error('No se encotro el servicio');
        err.statusCode = 404;
        throw err;
      }
      data.servicio_id = servicio_id;
    }
    if (cargo) {
      data.cargo = cargo;
    }
    if (area) {
      data.area = area;
    }
    if (cantidad_personal) {
      data.cantidad_personal = cantidad_personal;
    }
    if (experiencia_minima) {
      data.experiencia_minima = experiencia_minima;
    }
    if (nivel_academico) {
      data.nivel_academico = nivel_academico;
    }
    if (objetivo_cargo) {
      data.objetivo_cargo = objetivo_cargo;
    }
    if (descripcion) {
      data.descripcion = descripcion;
    }
    if (fecha_inicio) {
      data.fecha_inicio = fecha_inicio;
    }
    if (fecha_final) {
      data.fecha_final = fecha_final;
    }

    if (Object.keys(data).length === 0) {
      const err = new Error('No se enviaron datos para actualizar');
      err.statusCode = 400;
      throw err;
    }

    await convocatoriaSearch.update(data);

    return convocatoriaSearch;
  }
  static async cambiarEstado() {}
}
