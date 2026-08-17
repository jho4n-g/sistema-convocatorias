import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class FormacionAcademicaServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/admin/formacion-academica', {
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
  static async getSelectAreaTrabajo() {
    try {
      const response = await api.get(`/admin/formacion-academica/area-trabajo`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const response = await api.get(`/admin/formacion-academica/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post(`/admin/formacion-academica`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(
        `/admin/formacion-academica/${id}`,
        payload,
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
