'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permisos', [
      // CENTRO MEDICO
      {
        nombre_permiso: 'Ver centro medico',
        codigo_permiso: 'centroMedico.ver',
      },
      {
        nombre_permiso: 'Crear centro medico',
        codigo_permiso: 'centroMedico.crear',
      },
      {
        nombre_permiso: 'Editar centro medico',
        codigo_permiso: 'centroMedico.editar',
      },
      {
        nombre_permiso: 'Deshabilitar centro medico',
        codigo_permiso: 'centroMedico.deshabilitar',
      },

      // SERVICIO CENTRO MEDICO
      {
        nombre_permiso: 'Ver servicio centro medico',
        codigo_permiso: 'servicioCentro.ver',
      },
      {
        nombre_permiso: 'Crear servicio centro medico',
        codigo_permiso: 'servicioCentro.crear',
      },
      {
        nombre_permiso: 'Editar servicio centro medico',
        codigo_permiso: 'servicioCentro.editar',
      },
      {
        nombre_permiso: 'Deshabilitar servicio centro medico',
        codigo_permiso: 'servicioCentro.deshabilitar',
      },

      // AREA TRABAJO
      {
        nombre_permiso: 'Ver area trabajo',
        codigo_permiso: 'areaTrabajo.ver',
      },
      {
        nombre_permiso: 'Crear area trabajo',
        codigo_permiso: 'areaTrabajo.crear',
      },
      {
        nombre_permiso: 'Editar area trabajo',
        codigo_permiso: 'areaTrabajo.editar',
      },
      {
        nombre_permiso: 'Deshabilitar area trabajo',
        codigo_permiso: 'areaTrabajo.deshabilitar',
      },

      // CARGO INSTITUCIONAL
      {
        nombre_permiso: 'Ver cargo institucional',
        codigo_permiso: 'cargoInstitucional.ver',
      },
      {
        nombre_permiso: 'Crear cargo institucional',
        codigo_permiso: 'cargoInstitucional.crear',
      },
      {
        nombre_permiso: 'Editar cargo institucional',
        codigo_permiso: 'cargoInstitucional.editar',
      },
      {
        nombre_permiso: 'Deshabilitar cargo institucional',
        codigo_permiso: 'cargoInstitucional.deshabilitar',
      },

      // EXPERIENCIA GENERAL
      {
        nombre_permiso: 'Ver experiencia general',
        codigo_permiso: 'experienciaGeneral.ver',
      },
      {
        nombre_permiso: 'Crear experiencia general',
        codigo_permiso: 'experienciaGeneral.crear',
      },
      {
        nombre_permiso: 'Editar experiencia general',
        codigo_permiso: 'experienciaGeneral.editar',
      },
      {
        nombre_permiso: 'Deshabilitar experiencia general',
        codigo_permiso: 'experienciaGeneral.deshabilitar',
      },

      // EXPERIENCIA ESPECIFICA
      {
        nombre_permiso: 'Ver experiencia especifica',
        codigo_permiso: 'experienciaEspecifica.ver',
      },
      {
        nombre_permiso: 'Crear experiencia especifica',
        codigo_permiso: 'experienciaEspecifica.crear',
      },
      {
        nombre_permiso: 'Editar experiencia especifica',
        codigo_permiso: 'experienciaEspecifica.editar',
      },
      {
        nombre_permiso: 'Deshabilitar experiencia especifica',
        codigo_permiso: 'experienciaEspecifica.deshabilitar',
      },

      // FORMACION ACADEMICA
      {
        nombre_permiso: 'Ver formacion academica',
        codigo_permiso: 'formacionAcademica.ver',
      },
      {
        nombre_permiso: 'Crear formacion academica',
        codigo_permiso: 'formacionAcademica.crear',
      },
      {
        nombre_permiso: 'Editar formacion academica',
        codigo_permiso: 'formacionAcademica.editar',
      },
      {
        nombre_permiso: 'Deshabilitar formacion academica',
        codigo_permiso: 'formacionAcademica.deshabilitar',
      },
      // NIVE ACADEMICO
      {
        nombre_permiso: 'Ver nivel academico',
        codigo_permiso: 'nivelAcademico.ver',
      },
      {
        nombre_permiso: 'Crear nivel academico',
        codigo_permiso: 'nivelAcademico.crear',
      },
      {
        nombre_permiso: 'Editar nivel academico',
        codigo_permiso: 'nivelAcademico.editar',
      },

      // CONVOCATORIA
      {
        nombre_permiso: 'Ver convocatoria',
        codigo_permiso: 'convocatoria.ver',
      },
      {
        nombre_permiso: 'Crear convocatoria',
        codigo_permiso: 'convocatoria.crear',
      },
      {
        nombre_permiso: 'Editar convocatoria',
        codigo_permiso: 'convocatoria.editar',
      },
      //VER POSTULANTES
      {
        nombre_permiso: 'Ver postulantes',
        codigo_permiso: 'postulantes.ver',
      },
      {
        nombre_permiso: 'Editar postulantes',
        codigo_permiso: 'postulantes.editar',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permisos', null, {});
  },
};
