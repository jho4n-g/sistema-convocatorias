import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const uploadsBasePath = path.resolve(process.cwd(), 'uploads', 'postulaciones');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const postulacionId = Number(req.params.postulacionId);

    if (!Number.isInteger(postulacionId) || postulacionId <= 0) {
      const error = new Error('El ID de la postulación no es válido');

      error.statusCode = 400;

      return cb(error);
    }

    const destinationPath = path.join(uploadsBasePath, String(postulacionId));

    try {
      fs.mkdirSync(destinationPath, {
        recursive: true,
      });

      return cb(null, destinationPath);
    } catch (error) {
      return cb(error);
    }
  },

  filename: (req, file, cb) => {
    const match = file.fieldname.match(/^documento_(\d+)$/);

    if (!match) {
      const error = new Error('El identificador del requisito no es válido');

      error.statusCode = 400;

      return cb(error);
    }

    const requisitoId = Number(match[1]);

    if (!Number.isInteger(requisitoId) || requisitoId <= 0) {
      const error = new Error('El ID del requisito no es válido');

      error.statusCode = 400;

      return cb(error);
    }

    const nombreUnico = `${requisitoId}-${crypto.randomUUID()}.pdf`;

    return cb(null, nombreUnico);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const mimeTypeValido = file.mimetype === 'application/pdf';

  const extensionValida = extension === '.pdf';

  if (!mimeTypeValido || !extensionValida) {
    const error = new Error(
      `El archivo "${file.originalname}" debe estar en formato PDF`,
    );

    error.statusCode = 400;

    return cb(error, false);
  }

  return cb(null, true);
};

export const uploadPdf = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB por PDF

    files: 20, // máximo 20 archivos

    fields: 30,
  },
});
