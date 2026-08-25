import { VerPostulantesServices } from './verPostulantes.services.js';

export class VerPostulantesController {
  static async getAll(req, res) {
    const { id } = req.params;

    let idNumber = Number(id);
    if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
      throw new Error('El id no es un numero entero');
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let search = req.query.search;

    search =
      search && search !== 'undefined' && search !== 'null'
        ? search.trim()
        : '';

    const result = await VerPostulantesServices.getAll(id, page, limit, search);
    return res.status(200).json({
      ok: true,
      message: 'Postulantes obtenidas correctamente',
      ...result,
    });
  }
  static async getId(req, res) {
    const { id } = req.params;

    let idNumber = Number(id);
    if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
      throw new Error('El id no es un numero entero');
    }
    const data = await VerPostulantesServices.getId(id);
    return res.status(200).json({
      ok: true,
      message: 'Postulante obtenido correctamente',
      data,
    });
  }
  //agregar
  static async revisar(req, res, next) {
    const { id } = req.params;
    const payload = req.body;
    let idNumber = Number(id);
    if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
      throw new Error('El id no es un numero entero');
    }
    await VerPostulantesServices.revisar(id, payload);

    return res.status(200).json({
      ok: true,
      message: 'Se cambio correctamente el postulante',
    });
  }
}
