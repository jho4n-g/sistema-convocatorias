import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

export const nivelAcademicoModel = sequelize.define(
  'NivelAcademico',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'niveles_academicos',
    timestamps: true,
  },
);
