import { Op } from 'sequelize';
import { rolModel } from '../../../../models/auth/rol.model.js';
import { permisoModel } from '../../../../models/auth/permiso.model.js';
import { sequelize } from '../../../../config/database.js';
import { usuarioModel } from '../../../../models/auth/usuario.model.js';

export class RolService {
  static async getPermisos() {
    const data = await permisoModel.findAll();
    return data;
  }
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    let where = {
      nombre_rol: {
        [Op.notIn]: ['UsuarioNormal', 'admin_super_admin'],
      },
    };

    if (search) {
      where.nombre_rol[Op.iLike] = `%${search}%`;
    }

    const { count, rows } = await rolModel.findAndCountAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: permisoModel,
          as: 'permisos',
          attributes: ['nombre_permiso'],
          through: {
            attributes: [],
          },
        },
      ],
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      distinct: true,
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
    const dataId = await rolModel.findByPk(id, {
      attributes: { exclude: ['updatedAt', 'createdAt'] },
      include: [
        {
          model: permisoModel,
          as: 'permisos',
          attributes: ['id'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!dataId) {
      const err = new Error('No se encontro el rol');
      err.statuCode = 404;
      throw err;
    }
    const dataNor = {
      ...dataId.toJSON(),
      permisos: dataId?.permisos.map((row) => row.id),
    };
    return dataNor;
  }
  static async create(payload) {
    return await sequelize.transaction(async (t) => {
      const { nombre_rol, permisos = [] } = payload;

      const rolSearch = await rolModel.findOne({
        where: {
          nombre_rol,
        },
        transaction: t,
      });
      if (rolSearch) {
        const err = new Error('Ya existe un rol con ese nombre');
        err.statuCode = 409;
        throw err;
      }

      const permisosExistentes = await permisoModel.findAll({
        where: {
          id: {
            [Op.in]: permisos,
          },
        },
        transaction: t,
      });

      if (permisosExistentes.length !== permisos.length) {
        const err = new Error('Uno o varios permisos no existen');

        err.statusCode = 404;
        throw err;
      }
      const permisosIds = [...new Set(permisos)];

      const rolCreated = await rolModel.create(
        { nombre_rol },
        { transaction: t },
      );
      await rolCreated.setPermisos(permisosIds, {
        transaction: t,
      });

      const rolReload = await rolModel.findByPk(rolCreated.id, {
        include: [
          {
            model: permisoModel,
            as: 'permisos',
            through: {
              attributes: [],
            },
          },
        ],
        transaction: t,
      });
      return rolReload;
    });
  }
  static async update(id, payload) {
    return await sequelize.transaction(async (t) => {
      const { nombre_rol, permisos = [] } = payload;
      const rolSearch = await rolModel.findByPk(id, { transaction: t });
      if (!rolSearch) {
        const err = new Error('No existe el rol');
        err.statuCode = 404;
        throw err;
      }

      if (nombre_rol && nombre_rol !== rolSearch.nombre_rol) {
        const rolExistente = await rolModel.findOne({
          where: { nombre_rol },
          transaction: t,
        });

        if (rolExistente) {
          const err = new Error('Ya existe un rol con ese nombre');
          err.statusCode = 409;
          throw err;
        }

        await rolSearch.update({ nombre_rol }, { transaction: t });
      }

      // Actualizar permisos si es necesario
      if (permisos && permisos.length > 0) {
        const permisosIds = [...new Set(permisos)];
        const permisosExistentes = await permisoModel.findAll({
          where: {
            id: {
              [Op.in]: permisosIds,
            },
          },
          transaction: t,
        });

        if (permisosExistentes.length !== permisosIds.length) {
          const err = new Error('Uno o varios permisos no existen');

          err.statusCode = 404;
          throw err;
        }

        await rolSearch.setPermisos(permisosIds, { transaction: t });
      }

      const rolReload = await rolModel.findByPk(rolSearch.id, {
        include: [
          {
            model: permisoModel,
            as: 'permisos',
            through: {
              attributes: [],
            },
          },
        ],
        transaction: t,
      });
      return rolReload;
    });
  }
  static async delete(id) {
    const rolSearch = await rolModel.findByPk(id);
    if (!rolSearch) {
      const err = new Error('No existe el rol');
      err.statuCode = 404;
      throw err;
    }
    const usuarioRol = await usuarioModel.findAll({
      where: {
        rol_id: rolSearch.id,
      },
    });
    if (usuarioRol.length > 0) {
      const err = new Error('Existe usuario con este rol');
      err.statuCode = 404;
      throw err;
    }
    await rolSearch.destroy();
    return;
  }
  //
  static async getAllSelect() {
    const data = await rolModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_rol', 'label'],
      ],
      where: {
        nombre_rol: {
          [Op.notIn]: ['UsuarioNormal', 'admin_super_admin'],
        },
      },
    });
    return data;
  }
}
