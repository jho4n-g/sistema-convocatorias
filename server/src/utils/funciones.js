export const convertirFechaATexto = (fecha) => {
  if (!fecha) return '';

  return new Intl.DateTimeFormat('es-BO', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
};
