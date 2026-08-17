import z from 'zod';
import {
  reqIntegerId,
  reqIntegerSelect,
  reqNewString,
  reqEnum,
} from '../../../validators/funcionesZod';

export const servicioCentroSchema = z.object({
  nombre_servicio: reqNewString({
    label: 'Centro medico',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'El nombre del servicio solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  centro_medico_id: reqIntegerSelect('Servicio de centro'),
  estado: reqEnum({ label: 'Estado', values: [true, false] }),
});

export const servicioCentroUpdateSchema = servicioCentroSchema.partial();
