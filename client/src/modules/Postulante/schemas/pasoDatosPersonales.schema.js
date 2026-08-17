import z from 'zod';

import {
  reqNewString,
  reqFecha,
  reqCelular,
} from '../../../validators/funcionesZod';

export const datosPersonalesSchema = z
  .object({
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
      label: 'Apellido paterno',
      min: 2,
      max: 100,
      regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
      regexMessage:
        'El apellido paterno solo puede contener letras, espacios, apóstrofes y guiones',
    }),

    apellido_materno: reqNewString({
      label: 'Apellido materno',
      min: 2,
      max: 100,
      regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
      regexMessage:
        'El apellido materno solo puede contener letras, espacios, apóstrofes y guiones',
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

    confirmar_contrasenia: z
      .string({
        message: 'Debe confirmar la contraseña',
      })
      .min(1, 'Debe confirmar la contraseña'),
  })
  .refine((data) => data.contrasenia === data.confirmar_contrasenia, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar_contrasenia'],
  });
