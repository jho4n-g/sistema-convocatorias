import z from 'zod';
import { reqInteger, reqNewString } from '../../../validators/funcionesZod.js';

export const experienciaGeneralSchema = z.object({
  label: reqNewString({
    label: 'Centro medico',
    min: 2,
    max: 100,
    regex: /^[\p{L}\p{N}]+(?:[\s'-][\p{L}\p{N}]+)*$/u,
    regexMessage:
      'El nombre del mes solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  meses_experiencia: reqInteger('Meses experiencia'),
});

export const experienciaGeneralUpdateSchema =
  experienciaGeneralSchema.partial();
