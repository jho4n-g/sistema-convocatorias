import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';
import { personaModel } from './persona.model.js';

export const experienciaLaboralModel = sequelize.define(
  'ExperienciaLaboral',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'personas',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    cargo_puesto: { type: DataTypes.STRING, allowNull: false },
    empresa_institucion: { type: DataTypes.STRING, allowNull: false },
    area: { type: DataTypes.STRING, allowNull: false },
    gestion: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'experiencias_laborales',
    timestamps: true,
  },
);

personaModel.hasMany(experienciaLaboralModel, {
  as: 'experienciasLaboral',
  foreignKey: 'persona_id',
});
experienciaLaboralModel.belongsTo(personaModel, {
  as: 'personaExperiencia',
  foreignKey: 'persona_id',
});
