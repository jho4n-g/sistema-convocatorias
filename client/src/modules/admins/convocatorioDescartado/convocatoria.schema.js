import { z } from 'zod';

import {
  reqNewString,
  reqFecha,
  reqInteger,
  reqIntegerId,
} from '../../../validators/funcionesZod';

const regexSoloLetras = /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u;

const convocatoriaBaseSchema = z.object({
  servicio_id: reqIntegerId({
    label: 'Servicio',
  }),

  titulo: reqNewString({
    label: 'Título',
    min: 2,
    max: 150,
  }),

  cargo: reqNewString({
    label: 'Cargo',
    min: 2,
    max: 100,
    regex: regexSoloLetras,
    regexMessage:
      'El cargo solo puede contener letras, espacios, apóstrofes y guiones',
  }),

  area: reqNewString({
    label: 'Área',
    min: 2,
    max: 100,
    regex: regexSoloLetras,
    regexMessage:
      'El área solo puede contener letras, espacios, apóstrofes y guiones',
  }),

  cantidad_personal: reqInteger('Cantidad de personal', false),

  experiencia_minima: reqInteger('Experiencia mínima', false),

  nivel_academico: reqNewString({
    label: 'Nivel académico',
    min: 2,
    max: 150,
  }),

  objetivo_cargo: reqNewString({
    label: 'Objetivo del cargo',
    min: 2,
    max: 1000,
  }),

  descripcion: reqNewString({
    label: 'Descripción',
    min: 2,
    max: 2000,
  }),

  fecha_inicio: reqFecha('Fecha de inicio'),

  fecha_final: reqFecha('Fecha final'),
});

export const convocatoriaSchema = convocatoriaBaseSchema.superRefine(
  (data, ctx) => {
    const fechaInicio = new Date(data.fecha_inicio);
    const fechaFinal = new Date(data.fecha_final);

    if (
      !Number.isNaN(fechaInicio.getTime()) &&
      !Number.isNaN(fechaFinal.getTime()) &&
      fechaFinal < fechaInicio
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fecha_final'],
        message:
          'La fecha final debe ser igual o posterior a la fecha de inicio',
      });
    }
  },
);

export const convocatoriaUpdateSchema = convocatoriaBaseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });
