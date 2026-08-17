import { api } from '../../services/api';
import { toServiceError } from '../../services/error';

export class PostulanteSerivices {
  static async getSelectNivelAcademico() {
    try {
      const response = await api.get(`/public/persona/nivel-academico`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getDocumentos(id) {
    try {
      const response = await api.get(`/public/persona/documentos/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async register(id, payload) {
    try {
      const formData = new FormData();
      formData.append('cedula_identidad', payload.cedula_identidad);
      formData.append('nombres', payload.nombres);
      formData.append('apellido_paterno', payload.apellido_paterno);
      formData.append('apellido_materno', payload.apellido_materno);
      formData.append('fecha_nacimiento', payload.fecha_nacimiento);
      formData.append('numero_celular', payload.numero_celular);
      formData.append('correo', payload.correo);
      formData.append('contrasenia', payload.contrasenia);
      formData.append('formaciones', JSON.stringify(payload.formaciones));
      formData.append('experiencias', JSON.stringify(payload.experiencias));

      formData.append(
        'trabajo_anteriormente_institucion',
        payload.trabajo_anteriormente_institucion,
      );
      Object.entries(payload.documentos).forEach(([requisitoId, archivo]) => {
        formData.append(`documento_${requisitoId}`, archivo);
      });
      const response = await api.post(`/public/persona/${id}`, formData);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
