import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { centroMedicoModel } from './centroMedico.model.js';

export const servicioCentroModel = sequelize.define(
  'servicioCentro',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    centro_medico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'centros_medico',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    nombre_servicio: { type: DataTypes.STRING, allowNull: false },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'servicios_centro',
    timestamps: true,
  },
);

centroMedicoModel.hasMany(servicioCentroModel, {
  as: 'serviciosCentro',
  foreignKey: 'centro_medico_id',
});
servicioCentroModel.belongsTo(centroMedicoModel, {
  as: 'centroMedico',
  foreignKey: 'centro_medico_id',
});
