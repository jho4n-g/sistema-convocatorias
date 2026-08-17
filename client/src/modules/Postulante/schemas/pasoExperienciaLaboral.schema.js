import z from 'zod';
import {
  reqIntegerId,
  reqNewString,
  reqFecha,
  reqCelular,
  reqIntegerSelect,
  reqEnum,
} from '../../../validators/funcionesZod';

export const datosExperienciaSchema = z.object({
  cargo_puesto: reqNewString({
    label: 'Cargo',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'El cargo solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  empresa_institucion: reqNewString({
    label: 'Empresa',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'La empresa/intitucion solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  area: reqNewString({
    label: 'Area',
    min: 2,
    max: 100,
    regex: /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u,
    regexMessage:
      'El area solo pueden contener letras, espacios, apóstrofes y guiones',
  }),
  gestion: reqNewString({
    label: 'Gestión',
    min: 6,
    max: 7,
    regex: /^(I|II)\/\d{4}$/,
    regexMessage: 'La gestión debe tener el formato I/2025 o II/2025',
  }),
});
