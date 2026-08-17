import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class ServiceCentroServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/admin/servicio-centro', {
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
      const response = await api.get(`/admin/servicio-centro/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('/admin/servicio-centro', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/servicio-centro/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async CambioEstado(id) {
    try {
      const response = await api.patch(
        `/admin/servicio-centro/cambiar-estado/${id}`,
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
