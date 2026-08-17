import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';
import { personaModel } from './persona.model.js';
import { nivelAcademicoModel } from './nivelAcademico.model.js';

export const formacionAcademicaPersonaModel = sequelize.define(
  'FormacionAcademicaPersona',
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
    nivel_academico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'niveles_academicos',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    estado: {
      type: DataTypes.ENUM('EN_CURSO', 'FINALIZADO', 'PENDIENTE'),
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    institucion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'formacion_academica_persona',
    timestamps: true,
  },
);

personaModel.hasMany(formacionAcademicaPersonaModel, {
  as: 'formacionesPersonas',
  foreignKey: 'persona_id',
});

formacionAcademicaPersonaModel.belongsTo(personaModel, {
  as: 'personaFormacion',
  foreignKey: 'persona_id',
});

nivelAcademicoModel.hasMany(formacionAcademicaPersonaModel, {
  as: 'formacionesNivelAcademico',
  foreignKey: 'nivel_academico_id',
});
formacionAcademicaPersonaModel.belongsTo(nivelAcademicoModel, {
  as: 'nivelAcademico',
  foreignKey: 'nivel_academico_id',
});
