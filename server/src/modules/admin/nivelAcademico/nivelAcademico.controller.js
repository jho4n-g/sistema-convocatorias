import { NivelAcademicoServices as services } from './nivelAcademico.services.js';

export class NivelAcademicoController {
  static async getAll(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let search = req.query.search;

    search =
      search && search !== 'undefined' && search !== 'null'
        ? search.trim()
        : '';

    const result = await services.getAll(page, limit, search);

    return res.status(200).json({
      ok: true,
      message: 'Niveles academicos obtenidos correctamente',
      ...result,
    });
  }
  static async getAllSelect(req, res) {
    const data = await services.getAllSelect();

    return res.status(200).json({
      ok: true,
      message: 'Nivel academico obtenido correctamente',
      data,
    });
  }
  static async create(req, res) {
    const payload = req.body;

    const data = await services.create(payload);

    return res
      .status(200)
      .json({
        ok: true,
        message: 'Nivel academico creado correctamente',
        data,
      });
  }
  static async update(req, res) {
    const { id } = req.params;
    const payload = req.body;

    let idNumber = Number(id);
    if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
      throw new Error('El id no es un numero entero');
    }

    const data = await services.update(id, payload);
    return res.status(200).json({
      ok: true,
      message: 'Nivel academico actuzalizado correctamente',
      data,
    });
  }
}
