import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { permisoModel } from './permiso.model.js';

export const rolModel = sequelize.define(
  'Rol',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_rol: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    tableName: 'roles',
    timestamps: true,
  },
);

export const rolPermisoModel = sequelize.define(
  'rolPermiso',
  {
    rol_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    permiso_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'permisos',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'rol_permiso',
    timestamps: false,
  },
);

rolModel.belongsToMany(permisoModel, {
  through: rolPermisoModel,
  as: 'permisos',
  foreignKey: 'rol_id',
  otherKey: 'permiso_id',
});
permisoModel.belongsToMany(rolModel, {
  through: rolPermisoModel,
  foreignKey: 'permiso_id',
  otherKey: 'rol_id',
});
