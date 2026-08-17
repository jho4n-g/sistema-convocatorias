import z from 'zod';
import { reqNewString } from '../../../validators/funcionesZod';

export const centroMedicoSchema = z.object({
  nombre_centro: reqNewString({
    label: 'Centro medico',
    min: 2,
    max: 100,
    regex: /^[\p{L}\p{N}]+(?:[\s'-][\p{L}\p{N}]+)*$/u,
    regexMessage:
      'El nombre del centro medico solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
});
