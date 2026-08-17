import z from 'zod';
import {
  reqIntegerId,
  reqNewString,
} from '../../../validators/funcionesZod.js';

export const servicioCentroSchema = z.object({
  nombre_servicio: reqNewString({
    label: 'Centro medico',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'El nombre del servicio solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  centro_medico_id: reqIntegerId({ label: 'centro_medico_id' }),
});

export const servicioCentroUpdateSchema = servicioCentroSchema.partial();
