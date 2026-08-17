import z from 'zod';
import { reqNewString } from '../../../validators/funcionesZod.js';

export const experienciaEspecificaSchema = z.object({
  nombre_experiencia: reqNewString({
    label: 'Centro medico',
    min: 2,
    max: 200,
    regex: /^[\p{L}\p{N}]+(?:[\s'-][\p{L}\p{N}]+)*$/u,
    regexMessage:
      'El nombre del area trabajo solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
});
