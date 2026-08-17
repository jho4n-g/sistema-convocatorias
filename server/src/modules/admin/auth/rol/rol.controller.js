import { RolService as services } from './rol.services.js';

export class RolController {
  static async getPermisos(req, res) {
    const data = await services.getPermisos();

    return res
      .status(200)
      .json({ ok: true, message: 'Permisos obtenidos correctamente', data });
  }
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
      message: 'Roles obtenidos correctamente',
      ...result,
    });
  }
  static async getId(req, res) {
    const { id } = req.params;

    let idNumber = Number(id);
    if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
      throw new Error('El id no es un numero entero');
    }
    const data = await services.getId(idNumber);
    return res
      .status(200)
      .json({ ok: true, message: 'Rol obtenido correctamente', data });
  }
  static async create(req, res) {
    const payload = req.body;
    const data = await services.create(payload);
    return res
      .status(200)
      .json({ ok: true, message: 'Rol creado correctamente', data });
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
      message: 'Rol actuzalizado correctamente',
      data,
    });
  }
  static async delete(req, res) {
    const { id } = req.params;

    let idNumber = Number(id);
    if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
      throw new Error('El id no es un numero entero');
    }
    await services.delete(idNumber);
    return res.status(200).json({
      ok: true,
      message: 'Rol eliminado correctamente',
    });
  }
  static async getAllSelect(req, res) {
    const data = await services.getAllSelect();
    return res.status(200).json({
      ok: true,
      message: 'Roles obtenidos correctamente',
      data,
    });
  }
}
