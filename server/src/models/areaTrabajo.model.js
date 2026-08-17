import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const areaTrabajoModel = sequelize.define(
  'areaTrabajo',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_area: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'area_trabajo',
    timestamps: true,
  },
);
