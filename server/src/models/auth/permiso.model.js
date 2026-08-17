import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const permisoModel = sequelize.define(
  'Permiso',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_permiso: { type: DataTypes.STRING },
    codigo_permiso: { type: DataTypes.STRING },
  },
  {
    tableName: 'permisos',
    timestamps: false,
  },
);
