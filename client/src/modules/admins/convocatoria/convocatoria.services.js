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
  static async getSelectAreaTrabajo() {
    try {
      const response = await api.get('/admin/convocatoria/area-trabajo');
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectCentroMedico() {
    try {
      const response = await api.get('/admin/convocatoria/centro-medico');
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectCentroMedico() {
    try {
      const response = await api.get('/admin/convocatoria/centro-medico');
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectExperienciaEspecifica() {
    try {
      const response = await api.get(
        '/admin/convocatoria/experiencia-especifica',
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectExperienciaGeneral() {
    try {
      const response = await api.get('/admin/convocatoria/experiencia-general');
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getSelectServicioMedico(id) {
    try {
      const response = await api.get(
        `/admin/convocatoria/servicio-medico/${id}`,
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectCargoInstitucional(id) {
    try {
      const response = await api.get(
        `/admin/convocatoria/cargo-institucional/${id}`,
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getSelectFormacionAcademica(id) {
    try {
      const response = await api.get(
        `/admin/convocatoria/formacion-academica/${id}`,
      );
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
