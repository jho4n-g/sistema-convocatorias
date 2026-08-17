import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class ExperienciaEspecificaServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/admin/experiencia-especifica', {
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

  static async create(payload) {
    try {
      const response = await api.post(`/admin/experiencia-especifica`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(
        `/admin/experiencia-especifica/${id}`,
        payload,
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
