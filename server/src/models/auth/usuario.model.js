import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { rolModel } from './rol.model.js';

export const usuarioModel = sequelize.define(
  'Usuario',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    correo: { type: DataTypes.STRING, unique: true, allowNull: false },
    contrasenia: { type: DataTypes.STRING, allowNull: false },
    debe_cambiar_contrasenia: { type: DataTypes.BOOLEAN, defaultValue: true },
    // correo_verificado: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    //   allowNull: false,
    // },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'ACTIVO', 'BLOQUEADO', 'INACTIVO'),
      defaultValue: 'PENDIENTE',
    },
    intentos_fallidos: { type: DataTypes.INTEGER, defaultValue: 0 },
    bloqueado_hasta: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
  },
);

rolModel.hasMany(usuarioModel, {
  as: 'usuarios',
  foreignKey: 'rol_id',
});

usuarioModel.belongsTo(rolModel, {
  as: 'rol',
  foreignKey: 'rol_id',
});
