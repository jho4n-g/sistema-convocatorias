'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const contraseniaHash = await bcrypt.hash('super_admin', 10);

    await queryInterface.bulkInsert('usuarios', [
      {
        id: 1,
        rol_id: 1,
        correo: 'super_admin',
        contrasenia: contraseniaHash,
        debe_cambiar_contrasenia: false,
        estado: 'ACTIVO',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', {
      id: 1,
    });
  },
};
