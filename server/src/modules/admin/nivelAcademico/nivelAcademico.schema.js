import z from 'zod';
import { reqNewString } from '../../../validators/funcionesZod.js';

export const nivelAcademicoSchema = z.object({
  nombre: reqNewString({
    label: 'Nivel academico',
    min: 2,
    max: 100,
    regex: /^[\p{L}\p{N}]+(?:[\s'-][\p{L}\p{N}]+)*$/u,
    regexMessage:
      'El nombre del nivel academico solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
});
