import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { col } from 'sequelize';
import { generateToken } from '../../utils/token.js';
import { usuarioModel } from '../../models/auth/usuario.model.js';
import { rolModel } from '../../models/auth/rol.model.js';
import { personaModel } from '../../models/persona.model.js';
import { personaAdminModel } from '../../models/personasAdmin.model.js';
import { permisoModel } from '../../models/auth/permiso.model.js';

export class LoginServices {
  static async iniciarSesion(payload) {
    const { correo, contrasenia } = payload;
    const usuarioSearch = await usuarioModel.findOne({
      where: {
        correo,
      },
    });

    if (!usuarioSearch) {
      const err = new Error('Credenciales incorrectas');
      err.statusCode = 400;
      throw err;
    }

    const isValido = await bcrypt.compare(
      contrasenia,
      usuarioSearch.contrasenia,
    );

    if (!isValido) {
      const err = new Error('Credenciales incorrectas');
      err.statusCode = 400;
      throw err;
    }

    const rolSearch = await rolModel.findByPk(usuarioSearch.rol_id);

    if (rolSearch.nombre_rol === 'UsuarioNormal') {
      const personaSearch = await personaModel.findOne({
        where: {
          usuario_id: usuarioSearch.id,
        },
        attributes: {
          include: [[col('usuarioPersona.rol.nombre_rol'), 'nombre_rol']],
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: usuarioModel,
            as: 'usuarioPersona',
            attributes: ['id'],
            include: [
              {
                model: rolModel,
                as: 'rol',
                attributes: [],
              },
            ],
          },
        ],
      });

      const persona = personaSearch.toJSON();

      const { usuarioPersona, ...resto } = persona;

      const data = {
        ...resto,
        permisos: [],
      };
      const token = generateToken({
        id: personaSearch.id,
        usuario_id: personaSearch.usuario_id,
      });
      return { data, token };
    } else {
      const personaSearch = await personaAdminModel.findOne({
        where: {
          usuario_id: usuarioSearch.id,
        },
        attributes: {
          include: [[col('personaAdminUsuario.rol.nombre_rol'), 'nombre_rol']],
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: usuarioModel,
            as: 'personaAdminUsuario',
            attributes: ['id'],
            include: [
              {
                model: rolModel,
                as: 'rol',
                include: [
                  {
                    model: permisoModel,
                    as: 'permisos',
                    attributes: ['nombre_permiso', 'codigo_permiso'],
                    through: {
                      attributes: [],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      const persona = personaSearch.toJSON();

      const { personaAdminUsuario, ...resto } = persona;

      const data = {
        ...resto,

        permisos:
          personaAdminUsuario?.rol?.permisos.map((row) => row.codigo_permiso) ??
          [],
      };

      const token = generateToken({
        id: personaSearch.id,
        usuario_id: personaSearch.usuario_id,
      });
      return { data, token };
    }
  }
}
