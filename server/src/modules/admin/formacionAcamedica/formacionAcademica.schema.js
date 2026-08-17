import z from 'zod';
import {
  reqArrayIntegerIds,
  reqIntegerId,
  reqNewString,
} from '../../../validators/funcionesZod.js';

export const formacionAcademicaSchema = z.object({
  nombre_formacion: reqNewString({
    label: 'Nombre formacion',
    min: 2,
    max: 100,
    regex: /^[\p{L}\p{N}]+(?:[\s'-][\p{L}\p{N}]+)*$/u,
    regexMessage:
      'El nombre de la formacion solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  area_trabajo_ids: reqArrayIntegerIds({ label: 'Areas trabajo', minItems: 1 }),
});

export const formacionAcademicaUpdateSchema =
  formacionAcademicaSchema.partial();
