import { api } from '../../../services/api.js';
import { toServiceError } from '../../../services/error.js';

export class CentroMedicoServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/admin/centro-medico', {
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
  static async getAllSelect() {
    try {
      const response = await api.get('/admin/centro-medico/seleccion');
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('/admin/centro-medico', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/centro-medico/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
