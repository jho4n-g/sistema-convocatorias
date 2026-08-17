import { PersonaServices } from './persona.services.js';
import { eliminarArchivos } from '../../../utils/eliminarArchivos.js';
export class PersonaController {
  static async registre(req, res) {
    const archivos = req.files ?? [];
    try {
      const { postulacionId } = req.params;
      const payload = req.body;

      if (archivos.length === 0) {
        const error = new Error('Debe enviar al menos un documento PDF');
        error.statusCode = 400;
        throw error;
      }

      const idNumber = Number(postulacionId);

      if (Number.isNaN(idNumber) || !Number.isInteger(idNumber)) {
        const error = new Error('El id no es un número entero');
        error.statusCode = 400;
        throw error;
      }

      const data = await PersonaServices.register(idNumber, payload, archivos);

      return res.status(200).json({
        ok: true,
        message: 'Registro guardado correctamente',
        data,
      });
    } catch (e) {
      await eliminarArchivos(archivos);

      throw e;
    }
  }
}
