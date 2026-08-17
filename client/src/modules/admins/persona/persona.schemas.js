import z from 'zod';
import {
  reqIntegerId,
  reqNewString,
  reqFecha,
  reqCelular,
  reqIntegerSelect,
} from '../../../validators/funcionesZod.js';

export const personaAdminSchema = z.object({
  servicio_id: reqIntegerSelect('Servicio'),
  rol_id: reqIntegerSelect('Rol'),
  cedula_identidad: reqNewString({
    label: 'Cédula de identidad',
    min: 4,
    max: 16,
    regex: /^[0-9]{4,12}(?:-[0-9A-Za-z]{1,3})?$/,
    regexMessage:
      'La cédula debe contener entre 4 y 12 números y, opcionalmente, un complemento',
  }),
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
  fecha_nacimento: reqFecha('Fecha nacimiento'),
  numero_celular: reqCelular('Celular'),
  correo: reqNewString({
    label: 'Correo electrónico',
    min: 5,
    max: 150,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    regexMessage: 'Debe ingresar un correo electrónico válido',
  }).transform((correo) => correo.toLowerCase()),
});

export const personaAdminUpdateSchema = personaAdminSchema.partial();
