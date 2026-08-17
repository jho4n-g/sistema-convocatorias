'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('personasAdmin', [
      {
        id: 1,
        usuario_id: 1,
        cedula_identidad: 12345678,
        nombres: 'super_admin',
        apellido_paterno: 'super_admin',
        apellido_materno: 'super_admin',
        fecha_nacimento: '2025-01-08',
        numero_celular: 12345678,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('personasAdmin', {
      id: 1,
    });
  },
};
