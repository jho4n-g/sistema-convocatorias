import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const experienciaGeneralModel = sequelize.define(
  'ExperienciaGenera',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    meses_experiencia: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'experiencia_general',
    timestamps: true,
  },
);
