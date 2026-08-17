import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const centroMedicoModel = sequelize.define(
  'CentroMedico',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_centro: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'centros_medico',
    timestamps: true,
  },
);
