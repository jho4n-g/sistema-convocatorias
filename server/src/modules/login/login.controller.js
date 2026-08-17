import { LoginServices as services } from './login.services.js';

export class LoginController {
  static async iniciarSesion(req, res) {
    const payload = req.body;
    const data = await services.iniciarSesion(payload);
    return res
      .status(200)
      .json({ ok: true, message: 'Inicio de sesion correcta', ...data });
  }
  static async geMe(req, res) {
    const data = req.usuario;
    return req
      .status(200)
      .json({ ...data, ok: true, message: 'Usuario obtenido correctamente' });
  }
}
