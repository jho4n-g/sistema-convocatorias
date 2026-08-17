import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class PersonaServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get('/admin/persona', {
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
      const response = await api.get(`/admin/persona/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectCentros() {
    try {
      const response = await api.get(`/admin/persona/centros-medicos/`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectServicios(id) {
    try {
      const response = await api.get(`/admin/persona/servicios/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectRoles() {
    try {
      const response = await api.get(`/admin/persona/roles`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post(`/admin/persona`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/persona/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async cambiarEstado(id) {
    try {
      const response = await api.patch(`/admin/persona/cambiar-estado/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
