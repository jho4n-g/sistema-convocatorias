import { api } from '../../services/api';
import { toServiceError } from '../../services/error';

export class LoginServices {
  static async iniciarSesion(payload) {
    try {
      const response = await api.post('/login', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
