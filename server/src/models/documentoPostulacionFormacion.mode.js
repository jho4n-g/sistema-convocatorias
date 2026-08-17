import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { potulacionModel } from './postulacion.model.js';
import { convocatoriaFormacionAcademicaModel } from './formacionAcademica.model.js';

export const DocumentoPostulacionFormacionAcademicaModel = sequelize.define(
  'DocumentoPostulacionFormacion',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    postulacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'postulaciones',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    convocatoria_formacion_di: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'convocatoria_formacion_academica',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    path: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'documento_postulacion_formacion_academica',
    timestamps: true,
  },
);
potulacionModel.hasMany(DocumentoPostulacionFormacionAcademicaModel, {
  as: 'documentosPostulacion',
  foreignKey: 'postulacion_id',
});
DocumentoPostulacionFormacionAcademicaModel.belongsTo(potulacionModel, {
  foreignKey: 'postulacion_id',
});

convocatoriaFormacionAcademicaModel.hasMany(
  DocumentoPostulacionFormacionAcademicaModel,
  {
    as: 'documentosFormacion',
    foreignKey: 'convocatoria_formacion_di',
  },
);

DocumentoPostulacionFormacionAcademicaModel.belongsTo(
  convocatoriaFormacionAcademicaModel,
  {
    as: 'convocatoriaDocumento',
    foreignKey: 'convocatoria_formacion_di',
  },
);
