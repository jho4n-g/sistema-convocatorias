import z from 'zod';
import { reqNewString } from '../../../validators/funcionesZod.js';

export const areaTrabajoSchema = z.object({
  nombre_area: reqNewString({
    label: 'Centro medico',
    min: 2,
    max: 100,
    regex: /^[\p{L}\p{N}]+(?:[\s'-][\p{L}\p{N}]+)*$/u,
    regexMessage:
      'El nombre del area trabajo solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
});
