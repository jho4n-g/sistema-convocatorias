import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class ConvocatoriaServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/public/convocatoria', {
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
      const response = await api.get(`/public/convocatoria/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
