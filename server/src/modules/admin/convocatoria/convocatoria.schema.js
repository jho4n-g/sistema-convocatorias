import { z } from 'zod';

import {
  reqNewString,
  reqFecha,
  reqInteger,
  reqIntegerId,
  reqEnum,
  reqArrayIntegerIds,
} from '../../../validators/funcionesZod.js';

const regexSoloLetras = /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u;

const convocatoriaBaseSchema = z.object({
  cargo_institucional_id: reqIntegerId({ label: 'Cargo institucional' }),
  experiencia_general_id: reqIntegerId({ label: 'Experiencia general' }),
  servicio_revisor_id: reqIntegerId({ label: 'Servicio revisor' }),
  cantidad_personal: reqInteger('Cantidad de personal', false),
  titulo_cargo: reqNewString({
    label: 'Cargo',
    min: 2,
    max: 100,
    regex: regexSoloLetras,
    regexMessage:
      'El cargo solo puede contener letras, espacios, apóstrofes y guiones',
  }),
  objetivo_cargo: reqNewString({
    label: 'Objetivo del cargo',
    min: 2,
    max: 1000,
    required: false,
    regex: regexSoloLetras,
    regexMessage:
      'El objetivo del cargo solo puede contener letras, espacios, apóstrofes y guiones',
  }),
  descripcion: reqNewString({
    label: 'Descripcion',
    min: 2,
    max: 2000,
    required: false,
    regex: regexSoloLetras,
    regexMessage:
      'El Descripcion solo puede contener letras, espacios, apóstrofes y guiones',
  }),

  estado: reqEnum({
    label: 'Estado',
    values: ['BORRADOR', 'PUBLICADO', 'ANULADO', 'BLOQUEADO'],
  }),
  fecha_publicacion: reqFecha('Fecha de inicio'),
  fecha_cierre: reqFecha('Fecha final'),
  formacion_academica_ids: reqArrayIntegerIds({ label: 'Fomacion academica' }),
  experiencia_especifica_ids: reqArrayIntegerIds({
    label: 'Experiencia minima',
  }),
});
export const convocatoriaSchema = convocatoriaBaseSchema.superRefine(
  (data, ctx) => {
    const fechaInicio = new Date(data.fecha_publicacion);
    const fechaFinal = new Date(data.fecha_cierre);

    if (
      !Number.isNaN(fechaInicio.getTime()) &&
      !Number.isNaN(fechaFinal.getTime()) &&
      fechaFinal < fechaInicio
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fecha_final'],
        message:
          'La fecha de cierre debe ser igual o posterior a la fecha de inicio',
      });
    }
  },
);

export const convocatoriaUpdateSchema = convocatoriaBaseSchema.partial();
