import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { usuarioModel } from '../auth/usuario.model.js';

export const VerificarUsuarioModel = sequelize.define(
  'VerificarUsuario',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    codigo: { type: DataTypes.STRING, allowNull: false },
    tipo: {
      type: DataTypes.ENUM('REGISTRO', 'RECUPERAR_PASSWORD', 'CAMBIO_CORREO'),
      defaultValue: 'REGISTRO',
    },
    fecha_creacion: { type: DataTypes.DATE },
    fecha_expriracion: { type: DataTypes.DATE },
    intentos: { type: DataTypes.INTEGER },
    usado: { type: DataTypes.BOOLEAN, defaultValue: false },
    bloqueado: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: 'verificaciones_usuario',
    timestamps: true,
  },
);

usuarioModel.hasMany(VerificarUsuarioModel, {
  as: 'VerificacionesUsuario',
  foreignKey: 'usuario_id',
});
VerificarUsuarioModel.belongsTo(usuarioModel, {
  foreignKey: 'usuario_id',
});
