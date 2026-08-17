import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { usuarioModel } from './auth/usuario.model.js';
import { servicioCentroModel } from './servicioCentro.model.js';

export const personaAdminModel = sequelize.define(
  'PersonaAdmin',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    servicio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'servicios_centro',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    cedula_identidad: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido_paterno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido_materno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_nacimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    numero_celular: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'personasAdmin',
    timestamps: true,
  },
);

usuarioModel.hasOne(personaAdminModel, {
  as: 'usuarioAdminPersona',
  foreignKey: 'usuario_id',
});
personaAdminModel.belongsTo(usuarioModel, {
  as: 'personaAdminUsuario',
  foreignKey: 'usuario_id',
});
//
servicioCentroModel.hasMany(personaAdminModel, {
  as: 'personasServicio',
  foreignKey: 'servicio_id',
});
personaAdminModel.belongsTo(servicioCentroModel, {
  as: 'servicioPersona',
  foreignKey: 'servicio_id',
});
