import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class ConvocatoriaServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/admin/convocatoria', {
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
      const response = await api.get(`/admin/convocatoria/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post(`/admin/convocatoria`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/convocatoria/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
