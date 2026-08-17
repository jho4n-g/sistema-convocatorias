import z from 'zod';
import {
  reqIntegerId,
  reqNewString,
} from '../../../validators/funcionesZod.js';

export const cargoInstitucionalSchema = z.object({
  nombre_cargo: reqNewString({
    label: 'Centro medico',
    min: 2,
    max: 100,
    regex: /^[\p{L}\p{N}]+(?:[\s'-][\p{L}\p{N}]+)*$/u,
    regexMessage:
      'El nombre del area trabajo solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  area_trabajo_id: reqIntegerId({ label: 'Area de trabajo' }),
});

export const cargoInstitucionalUpdateSchema =
  cargoInstitucionalSchema.partial();
