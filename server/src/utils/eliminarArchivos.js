import fs from 'node:fs/promises';
import path from 'node:path';

export const eliminarArchivos = async (archivos = []) => {
  if (!Array.isArray(archivos) || archivos.length === 0) {
    return;
  }

  // Eliminar los PDFs
  await Promise.allSettled(
    archivos.map(async (archivo) => {
      if (!archivo?.path) return;

      try {
        await fs.unlink(archivo.path);
      } catch (error) {
        // Si ya no existe, no pasa nada
        if (error.code !== 'ENOENT') {
          console.error(`Error eliminando archivo ${archivo.path}:`, error);
        }
      }
    }),
  );

  // Obtener carpetas donde estaban los archivos
  const carpetas = [
    ...new Set(
      archivos
        .filter((archivo) => archivo?.path)
        .map((archivo) => path.dirname(archivo.path)),
    ),
  ];

  // Intentar eliminar las carpetas si quedaron vacías
  await Promise.allSettled(
    carpetas.map(async (carpeta) => {
      try {
        await fs.rmdir(carpeta);
      } catch (error) {
        // ENOTEMPTY = todavía tiene otros archivos
        // ENOENT = ya no existe
        if (error.code !== 'ENOTEMPTY' && error.code !== 'ENOENT') {
          console.error(`Error eliminando carpeta ${carpeta}:`, error);
        }
      }
    }),
  );
};
