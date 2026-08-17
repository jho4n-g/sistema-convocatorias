import { usuarioModel } from '../../../models/auth/usuario.model.js';
import { personaAdminModel } from '../../../models/personasAdmin.model.js';
import { rolModel } from '../../../models/auth/rol.model.js';
import { servicioCentroModel } from '../../../models/servicioCentro.model.js';
import { centroMedicoModel } from '../../../models/centroMedico.model.js';
import { sequelize } from '../../../config/database.js';
import bcrypt from 'bcrypt';
import { col, Op, Sequelize, fn } from 'sequelize';

export class PersonaAdminServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;
    search = search?.trim() || '';

    let where = {
      nombres: {
        [Op.notIn]: ['super_admin'],
      },
    };

    if (search) {
      where[Op.or] = [
        // Buscar por nombre completo
        Sequelize.where(
          Sequelize.fn(
            'concat',
            Sequelize.fn('COALESCE', Sequelize.col('PersonaAdmin.nombres'), ''),
            ' ',
            Sequelize.fn(
              'COALESCE',
              Sequelize.col('PersonaAdmin.apellido_paterno'),
              '',
            ),
            ' ',
            Sequelize.fn(
              'COALESCE',
              Sequelize.col('PersonaAdmin.apellido_materno'),
              '',
            ),
          ),
          {
            [Op.iLike]: `%${search}%`,
          },
        ),

        // Buscar por nombres individualmente
        {
          nombres: {
            [Op.iLike]: `%${search}%`,
          },
        },

        {
          area: {
            [Op.iLike]: `%${search}%`,
          },
        },

        {
          apellido_materno: {
            [Op.iLike]: `%${search}%`,
          },
        },

        // Buscar por cédula
        Sequelize.where(
          Sequelize.cast(
            Sequelize.col('PersonaAdmin.cedula_identidad'),
            'TEXT',
          ),
          {
            [Op.iLike]: `%${search}%`,
          },
        ),

        // Buscar por celular
        Sequelize.where(
          Sequelize.cast(Sequelize.col('PersonaAdmin.numero_celular'), 'TEXT'),
          {
            [Op.iLike]: `%${search}%`,
          },
        ),

        // Buscar por correo
        {
          '$personaAminUsuario.correo$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        // Buscar por servicio
        {
          '$servicioPersona.nombre_servicio$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        // Buscar por centro médico
        {
          '$servicioPersona.centroMedico.nombre_centro$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        // Buscar por rol
        {
          '$personaAminUsuario.rol.nombre_rol$': {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await personaAdminModel.findAndCountAll({
      attributes: {
        include: [
          [col('servicioPersona.nombre_servicio'), 'nombre_servicio'],
          [col('servicioPersona.centroMedico.nombre_centro'), 'nombre_centro'],
          [col('personaAdminUsuario.correo'), 'correo'],
          [col('personaAdminUsuario.estado'), 'estado_usuario'],
          [
            fn(
              'CONCAT',
              col('nombres'),
              ' ',
              col('apellido_paterno'),
              ' ',
              col('apellido_materno'),
            ),
            'nombre_completo',
          ],
        ],
        exclude: [
          'usuario_id',
          'servicio_id',
          'createdAt',
          'updatedAt',
          'nombres',
          'apellido_paterno',
          'apellido_materno',
        ],
      },

      include: [
        {
          model: servicioCentroModel,
          as: 'servicioPersona',
          attributes: [],
          required: false,
          include: [
            {
              model: centroMedicoModel,
              as: 'centroMedico',
              attributes: [],
              required: false,
            },
          ],
        },
        {
          model: usuarioModel,
          as: 'personaAdminUsuario',
          attributes: [],
          required: false,
          include: [
            {
              model: rolModel,
              as: 'rol',
              attributes: [],
              required: false,
            },
          ],
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

    const dataNormalizado = rows.map((row) => {
      const data = row.toJSON();

      return {
        ...data,
        nombre_centro:
          data?.servicioPersona?.centroMedico?.nombre_centro || null,
        rol: data?.personaAminUsuario?.rol?.nombre_rol || null,
      };
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
    const data = await personaAdminModel.findByPk(id, {
      attributes: {
        include: [
          [col('personaAdminUsuario.correo'), 'correo'],
          [col('personaAdminUsuario.estado'), 'estado'],
          [col('personaAdminUsuario.rol_id'), 'rol_id'],
          [col('servicioPersona.centro_medico_id'), 'centro_medico_id'],
        ],
        exclude: ['createdAt', 'updatedAt', 'usuario_id'],
      },
      include: [
        {
          model: servicioCentroModel,
          as: 'servicioPersona',
          attributes: [],
        },
        {
          model: usuarioModel,
          as: 'personaAdminUsuario',
          attributes: [],
        },
      ],
    });
    if (!data) {
      const err = new Error('No se encontro la persona');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
  static async create(payload) {
    return sequelize.transaction(async (t) => {
      const { cedula_identidad, correo, rol_id, servicio_id, ...parent } =
        payload;
      const correoExit = await usuarioModel.findOne({
        where: {
          correo,
        },
        raw: true,
        transaction: t,
      });
      if (correoExit) {
        const err = new Error('Ya existe un usuario con ese correo');
        err.statusCode = 409;
        throw err;
      }
      const cedulaExist = await personaAdminModel.findOne({
        where: {
          cedula_identidad,
        },
        raw: true,
        transaction: t,
      });

      if (cedulaExist) {
        const err = new Error(
          'Ya existe un usuario con esa cedula de identidad',
        );
        err.statusCode = 409;
        throw err;
      }
      const rolExist = await rolModel.findByPk(rol_id, {
        raw: true,
        transaction: t,
      });

      if (!rolExist) {
        const err = new Error('No se econtro el rol');
        err.statusCode = 404;
        throw err;
      }

      const servicioExist = await servicioCentroModel.findByPk(servicio_id, {
        raw: true,
        transaction: t,
      });
      if (!servicioExist) {
        const err = new Error('No se econtro el servicio');
        err.statusCode = 404;
        throw err;
      }

      const contraseniaHash = await bcrypt.hash(cedula_identidad, 12);

      const usuarioCreated = await usuarioModel.create(
        {
          rol_id: rol_id,
          correo: cedula_identidad,
          contrasenia: contraseniaHash,
          perfil_completo: true,
          estado: 'ACTIVO',
        },
        {
          transaction: t,
        },
      );

      delete usuarioCreated.contrasenia;
      delete usuarioCreated.debe_cambiar_contrasenia;
      delete usuarioCreated.perfil_completo;
      delete usuarioCreated.correo_verificado;
      delete usuarioCreated.intentos_fallidos;
      delete usuarioCreated.bloqueado_hasta;
      delete usuarioCreated.createdAt;
      delete usuarioCreated.updatedAt;

      const personaAdminCreated = await personaAdminModel.create(
        {
          usuario_id: usuarioCreated.id,
          servicio_id: servicioExist.id,
          cedula_identidad,
          ...parent,
        },
        {
          transaction: t,
        },
      );
      return { usuarioCreated, personaAdminCreated };
    });
  }
  static async update(id, payload) {
    return sequelize.transaction(async (t) => {
      const {
        correo,
        servicio_id,
        cedula_identidad,
        nombres,
        apellido_paterno,
        apellido_materno,
        fecha_nacimento,
        numero_celular,
      } = payload;
      let data = {};

      const dataSearch = await personaAdminModel.findByPk(id, {
        transaction: t,
      });

      if (!dataSearch) {
        const err = new Error('No se encontro la persona');
        err.statusCode = 404;
        throw err;
      }

      if (servicio_id) {
        const servicioExist = await servicioCentroModel.findByPk(servicio_id, {
          raw: true,
          transaction: t,
        });
        if (!servicioExist) {
          const err = new Error('No se econtro el servicio');
          err.statusCode = 404;
          throw err;
        }
        data.servicio_id = servicio_id;
      }
      if (cedula_identidad) {
        const cedulaExist = await personaAdminModel.findOne({
          where: {
            cedula_identidad,
          },
          raw: true,
          transaction: t,
        });

        if (cedulaExist) {
          const err = new Error(
            'Ya existe un usuario con esa cedula de identidad',
          );
          err.statusCode = 409;
          throw err;
        }
        data.cedula_identidad = cedula_identidad;
      }
      if (nombres) {
        data.nombres = nombres;
      }
      if (apellido_paterno) {
        data.apellido_paterno = apellido_paterno;
      }
      if (apellido_materno) {
        data.apellido_materno = apellido_materno;
      }
      if (fecha_nacimento) {
        data.fecha_nacimento = fecha_nacimento;
      }
      if (numero_celular) {
        data.numero_celular = numero_celular;
      }

      if (Object.keys(data).length > 0) {
        await dataSearch.update(data, { transaction: t });
      }

      let usuarioSearch;
      if (correo) {
        usuarioSearch = await usuarioModel.findByPk(dataSearch.usuario_id, {
          transaction: t,
        });
        const correoExist = await usuarioModel.findOne({
          where: {
            correo,
          },
          transaction: t,
        });
        if (correoExist) {
          const err = new Error('Ya existe un correo con ese usuario');
          statusCode = 409;
          throw err;
        }
        await usuarioSearch.update({ correo }, { transaction: t });
      }

      if (Object.keys(payload).length === 0 && correo === undefined) {
        const err = new Error('No se enviaron datos para actualizar');
        err.statusCode = 400;
        throw err;
      }
      return {
        persona: dataSearch,
        ...(usuarioSearch && { usuario: usuarioSearch }),
      };
    });
  }
  static async cambiarEstado(id) {
    const personaId = await personaAdminModel.findByPk(id);
    if (!personaId) {
      const err = new Error('No se encontro la persona');
      err.statusCode = 404;
      throw err;
    }
    const usuarioId = await usuarioModel.findByPk(personaId.usuario_id);

    if (!usuarioId) {
      const err = new Error('No se encontro el usuari');
      err.statusCode = 404;
      throw err;
    }
    const nuevoEstado = usuarioId.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    await usuarioId.update({
      estado: nuevoEstado,
    });

    return {
      id: usuarioId.id,
      estadoAnterior: usuarioId.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO',
      estado: nuevoEstado,
    };
  }
}
