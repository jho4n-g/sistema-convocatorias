import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { personaModel } from './persona.model.js';
import { convocatoriaModel } from './convocatoria.model.js';

export const potulacionModel = sequelize.define(
  'Postulacion',
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
    trabajo_anteriormente_institucion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    //Parcheee
    estado: {
      type: DataTypes.ENUM(
        'ENVIADO',
        'EN_REVISION',
        'REVISADO',
        'APROBADO',
        'OBSERVADO',
      ),
      defaultValue: 'ENVIADO',
    },
  },
  {
    tableName: 'postulaciones',
    timestamps: true,
  },
);
personaModel.hasMany(potulacionModel, {
  as: 'postulacionesPersonas',
  foreignKey: 'persona_id',
});
potulacionModel.belongsTo(personaModel, {
  as: 'personaPostulacion',
  foreignKey: 'persona_id',
});

convocatoriaModel.hasMany(potulacionModel, {
  as: 'postulantesConvocatorias',
  foreignKey: 'convocatoria_id',
});

potulacionModel.belongsTo(convocatoriaModel, {
  as: 'convocatoriaPostulantes',
  foreignKey: 'convocatoria_id',
});
