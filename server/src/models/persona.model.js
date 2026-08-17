import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { usuarioModel } from './auth/usuario.model.js';

export const personaModel = sequelize.define(
  'Persona',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    cedula_identidad: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_celular: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'personas',
    timestamps: true,
  },
);

usuarioModel.hasOne(personaModel, {
  as: 'personasUsuairo',
  foreignKey: 'usuario_id',
});

personaModel.belongsTo(usuarioModel, {
  as: 'usuarioPersona',
  foreignKey: 'usuario_id',
});
