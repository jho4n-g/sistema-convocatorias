import { col } from 'sequelize';
import jwt from 'jsonwebtoken';
import { usuarioModel } from '../models/auth/usuario.model.js';
import { rolModel } from '../models/auth/rol.model.js';
import { personaModel } from '../models/persona.model.js';
import { personaAdminModel } from '../models/personasAdmin.model.js';
import { permisoModel } from '../models/auth/permiso.model.js';

export const checkAuch = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        code: 'NoAutorizado',
        message: 'No autorizado',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuarioSearch = await usuarioModel.findByPk(decoded.usuario_id);

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

      req.usuario = data;
      return next();
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

      req.usuario = data;

      return next();
    }
  } catch (error) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        code: 'TokenExpiredError',
        message: 'Token expirado',
      });
    }

    return res.status(401).json({
      ok: false,
      code: 'TokenInvalido',
      message: 'Token inválido',
    });
  }
};
