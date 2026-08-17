import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AreaTrabajoServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/admin/cargo-institucional', {
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
      const response = await api.get(`/admin/cargo-institucional/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post(`/admin/cargo-institucional`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(
        `/admin/cargo-institucional/${id}`,
        payload,
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectAreaTrabajo() {
    try {
      const response = await api.get(`/admin/cargo-institucional/area-trabajo`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
