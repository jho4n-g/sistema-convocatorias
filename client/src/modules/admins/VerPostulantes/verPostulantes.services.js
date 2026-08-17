import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class VerPostulante {
  static async getAll(id, page, limit, search = '') {
    try {
      const response = await api.get(`/admin/ver-postulantes/${id}`, {
        params: {
          page,
          limit,
          search,
        },
      });
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const response = await api.get(`/admin/ver-postulantes/postulante/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async verDocumento(id) {
    try {
      const response = await api.get(`/usuario/documentos/ver/${id}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
