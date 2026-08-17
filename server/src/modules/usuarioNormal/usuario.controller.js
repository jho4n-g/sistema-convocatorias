import { UsuarioServices } from './usuario.services.js';

export class UsuarioController {
  static async ListaDocumentos(req, res) {
    const { id } = req.params;
    const user = req.usuario;
    let idNumber = Number(id);
    if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
      throw new Error('El id no es un numero entero');
    }

    const data = await UsuarioServices.ListaDocumentos(idNumber, user.id);
    return res.status(200).json({
      ok: true,
      message: 'Lista de documentos obtenidos correctamente',
      data,
    });
  }
  static async listaPostulaciones(req, res) {
    const user = req.usuario;

    const data = await UsuarioServices.listaPostulaciones(user.id);
    return res.status(200).json({
      ok: true,
      message: 'Lista de postulaciones obtenidas correctamente',
      data,
    });
  }
  static async obtenerDocumento(req, res) {
    const { id } = req.params;
    const idNumber = Number(id);

    if (!Number.isInteger(idNumber) || idNumber <= 0) {
      const error = new Error('El id del documento no es válido');
      error.statusCode = 400;
      throw error;
    }

    const documento = await UsuarioServices.obtenerDocumento(idNumber);

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader(
      'Content-Disposition',
      `inline; filename="documento-${documento.id}.pdf"`,
    );

    return res.sendFile(documento.path);
  }
  static async getMe(req, res) {
    const data = req.usuario;
    return res
      .status(200)
      .json({ ok: true, message: 'Usuario obtenido correctamente', data });
  }
}
