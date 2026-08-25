import { z } from 'zod';
import { reqEnum } from '../../../validators/funcionesZod.js';

export const estadoPostulante = z.object({
  estado: reqEnum({ label: 'Estado', values: ['OBSERVADO', 'APROBADO'] }),
});
