import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class MisPostulacionesServices {
  static async listaPostulaciones() {
    try {
      const response = await api.get('/usuario/postulaciones');
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getConvocatoriaId(id) {
    try {
      const response = await api.get(`/usuario/documentos/${id}`);
      console.log(response.data);
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
