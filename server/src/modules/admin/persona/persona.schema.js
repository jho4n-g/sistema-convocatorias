import z from 'zod';
import {
  reqIntegerId,
  reqNewString,
  reqFecha,
  reqCelular,
  reqIntegerSelect,
  jsonField,
  reqEnum,
  reqBoolean,
} from '../../../validators/funcionesZod.js';

const formacionSchema = z.object({
  nivel_academico_id: reqIntegerId({ label: 'Nivel Academico' }),
  titulo: reqNewString({
    label: 'Nombres',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'Los titulo solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  institucion: reqNewString({
    label: 'Institucion',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'Los institucion solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  estado: reqEnum({
    label: 'Estado',
    values: ['EN_CURSO', 'FINALIZADO', 'PENDIENTE'],
  }),
});

const experienciaSchema = z.object({
  cargo_puesto: reqNewString({
    label: 'Cargo',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'El cargo solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  empresa_institucion: reqNewString({
    label: 'Empresa',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'La empresa/intitucion solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  area: reqNewString({
    label: 'Area',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'El area solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  gestion: reqNewString({
    label: 'Gestión',
    min: 6,
    max: 7,
    regex: /^(I|II)\/\d{4}$/,
    regexMessage: 'La gestión debe tener el formato I/2025 o II/2025',
  }),
});

export const PersonaSchema = z.object({
  cedula_identidad: reqNewString({
    label: 'Cédula de identidad',
    min: 4,
    max: 16,
    regex: /^[0-9]{4,12}(?:-[0-9A-Za-z]{1,3})?$/,
    regexMessage:
      'La cédula debe contener entre 4 y 12 números y, opcionalmente, un complemento',
  }),
  trabajo_anteriormente_institucion: reqBoolean('Trabajo anterior mente'),
  nombres: reqNewString({
    label: 'Nombres',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'Los nombres solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  apellido_paterno: reqNewString({
    label: 'Apellidos',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'El apellido paterno solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  apellido_materno: reqNewString({
    label: 'Apellidos',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'El apellido materno solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  fecha_nacimiento: reqFecha('Fecha nacimiento'),
  numero_celular: reqCelular('Celular'),
  correo: reqNewString({
    label: 'Correo electrónico',
    min: 5,
    max: 150,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    regexMessage: 'Debe ingresar un correo electrónico válido',
  }).transform((correo) => correo.toLowerCase()),
  contrasenia: z
    .string({
      message: 'La contraseña es obligatoria',
    })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede superar los 72 caracteres'),
  formaciones: jsonField(
    z
      .array(formacionSchema)
      .min(1, 'Debe registrar al menos una formación académica'),
  ),

  experiencias: jsonField(z.array(experienciaSchema)),
});
