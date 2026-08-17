import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { areaTrabajoModel } from './areaTrabajo.model.js';

export const cargoInstitucionalModel = sequelize.define(
  'CargoInstitucional',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    area_trabajo_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'area_trabajo',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    nombre_cargo: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'cargo_institucional',
    timestamps: true,
  },
);

areaTrabajoModel.hasMany(cargoInstitucionalModel, {
  as: 'cargosInstitucionales',
  foreignKey: 'area_trabajo_id',
});
cargoInstitucionalModel.belongsTo(areaTrabajoModel, {
  as: 'areaTrabajo',
  foreignKey: 'area_trabajo_id',
});
