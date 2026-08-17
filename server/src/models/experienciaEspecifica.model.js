import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { convocatoriaModel } from './convocatoria.model.js';

export const experienciaEspecifica = sequelize.define(
  'experienciaEspecifica',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_experiencia: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'experiencia_especifica',
    timestamps: true,
  },
);

export const convocatoriaExperienciaEspecificaModel = sequelize.define(
  'convocatoriaExperienciaEspecifica',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    convocatoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'convocatorias',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    experiencia_especifica_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'experiencia_especifica',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  },
);

experienciaEspecifica.belongsToMany(convocatoriaModel, {
  through: convocatoriaExperienciaEspecificaModel,
  as: 'convocatoriasEE',
  foreignKey: 'experiencia_especifica_id',
  otherKey: 'convocatoria_id',
});

convocatoriaModel.belongsToMany(experienciaEspecifica, {
  through: convocatoriaExperienciaEspecificaModel,
  as: 'experienciasEspecificas',
  foreignKey: 'convocatoria_id',
  otherKey: 'experiencia_especifica_id',
});
