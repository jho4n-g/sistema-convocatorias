import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AreaTrabajoServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/admin/area-trabajo', {
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
      const response = await api.get(`/admin/area-trabajo/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post(`/admin/area-trabajo`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/area-trabajo/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
