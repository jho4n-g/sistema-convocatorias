import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class RolServices {
  static async getPermisos() {
    try {
      const response = await api.get('/admin/auth/rol/permisos');
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/admin/auth/rol', {
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
      const response = await api.get(`/admin/auth/rol/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('/admin/auth/rol', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/auth/rol/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
