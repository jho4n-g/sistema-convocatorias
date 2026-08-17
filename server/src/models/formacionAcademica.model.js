import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { convocatoriaModel } from './convocatoria.model.js';
import { areaTrabajoModel } from './areaTrabajo.model.js';

export const formacionAcademicaModel = sequelize.define(
  'FormacionAcademica',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_formacion: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'formacion_academica',
    timestamps: true,
  },
);

export const areaTrabajoFormacionAcademicaModel = sequelize.define(
  'AreaFormacionAcademica',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    area_trabajo_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'area_trabajo',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    formacion_academica_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formacion_academica',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'area_trabajo_formacion_academica',
    timestamps: true,
  },
);

areaTrabajoModel.belongsToMany(formacionAcademicaModel, {
  through: areaTrabajoFormacionAcademicaModel,
  as: 'formacionesAcademicas',
  foreignKey: 'area_trabajo_id',
  otherKey: 'formacion_academica_id',
});
formacionAcademicaModel.belongsToMany(areaTrabajoModel, {
  through: areaTrabajoFormacionAcademicaModel,
  foreignKey: 'formacion_academica_id',
  otherKey: 'area_trabajo_id',
  as: 'areasTrabajosFA',
});

//
areaTrabajoModel.hasMany(areaTrabajoFormacionAcademicaModel, {
  foreignKey: 'area_trabajo_id',
  as: 'areasFormacionesAT',
});
areaTrabajoFormacionAcademicaModel.belongsTo(areaTrabajoModel, {
  foreignKey: 'area_trabajo_id',
  as: 'areaTrabajoAFA',
});

formacionAcademicaModel.hasMany(areaTrabajoFormacionAcademicaModel, {
  foreignKey: 'formacion_academica_id',
  as: 'formacionesAcademciasFA',
});

areaTrabajoFormacionAcademicaModel.belongsTo(formacionAcademicaModel, {
  foreignKey: 'formacion_academica_id',
  as: 'formacionAcademicaAFA',
});

//------------------------------------------------------------
export const convocatoriaFormacionAcademicaModel = sequelize.define(
  'ConvocatoriaFormacionAcademica',
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
    area_formacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'area_trabajo_formacion_academica',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'convocatoria_formacion_academica',
    timestamps: true,
  },
);

convocatoriaModel.belongsToMany(areaTrabajoFormacionAcademicaModel, {
  through: convocatoriaFormacionAcademicaModel,
  as: 'formacionesAcademicasC',
  foreignKey: 'convocatoria_id',
  otherKey: 'area_formacion_id',
});
areaTrabajoFormacionAcademicaModel.belongsToMany(convocatoriaModel, {
  through: convocatoriaFormacionAcademicaModel,
  as: 'convocatoriasFA',
  foreignKey: 'area_formacion_id',
  otherKey: 'convocatoria_id',
});

//
areaTrabajoFormacionAcademicaModel.hasMany(
  convocatoriaFormacionAcademicaModel,
  {
    as: 'convocatoriasAreasFormacion',
    foreignKey: 'area_formacion_id',
  },
);

convocatoriaFormacionAcademicaModel.belongsTo(
  areaTrabajoFormacionAcademicaModel,
  {
    as: 'areasTrabajoFormacion',
    foreignKey: 'area_formacion_id',
  },
);
