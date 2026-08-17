import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { cargoInstitucionalModel } from './cargoInstitucional.model.js';
import { experienciaGeneralModel } from './experienciaGeneral.model.js';
import { servicioCentroModel } from './servicioCentro.model.js';

export const convocatoriaModel = sequelize.define(
  'Convocatoria',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cargo_institucional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cargo_institucional',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    experiencia_general_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'experiencia_general',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    servicio_revisor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'servicios_centro',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    titulo_cargo: {
      type: DataTypes.STRING,
    },
    cantidad_personal: {
      type: DataTypes.INTEGER,
    },
    objetivo_cargo: {
      type: DataTypes.STRING,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.ENUM('BORRADOR', 'PUBLICADO', 'ANULADO', 'BLOQUEADO'),
      defaultValue: 'BORRADOR',
    },
    fecha_publicacion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_cierre: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'convocatorias',
    timestamps: true,
  },
);

cargoInstitucionalModel.hasMany(convocatoriaModel, {
  as: 'convocatoriasCI',
  foreignKey: 'cargo_institucional_id',
});
convocatoriaModel.belongsTo(cargoInstitucionalModel, {
  as: 'cargoInstitucionalC',
  foreignKey: 'cargo_institucional_id',
});
//
experienciaGeneralModel.hasMany(convocatoriaModel, {
  as: 'convocatoriasEG',
  foreignKey: 'experiencia_general_id',
});
convocatoriaModel.belongsTo(experienciaGeneralModel, {
  as: 'experienciaGeneralC',
  foreignKey: 'experiencia_general_id',
});
//
servicioCentroModel.hasMany(convocatoriaModel, {
  as: 'convocatoriasSC',
  foreignKey: 'servicio_revisor_id',
});
convocatoriaModel.belongsTo(servicioCentroModel, {
  as: 'servicioCentroC',
  foreignKey: 'servicio_revisor_id',
});
