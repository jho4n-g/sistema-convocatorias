import z from 'zod';
import {
  reqIntegerId,
  reqNewString,
  reqFecha,
  reqCelular,
  reqIntegerSelect,
  reqEnum,
} from '../../../validators/funcionesZod';

export const datosFormacionAcademica = z.object({
  nivel_academico_id: reqIntegerId({ label: 'Nivel Academico' }),
  titulo: reqNewString({
    label: 'Nombres',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'Los titulo solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  institucion: reqNewString({
    label: 'Institucion',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'Los institucion solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  estado: reqEnum({
    label: 'Estado',
    values: ['EN_CURSO', 'FINALIZADO', 'PENDIENTE'],
  }),
});
