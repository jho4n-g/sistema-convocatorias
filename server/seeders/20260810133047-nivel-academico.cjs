'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('niveles_academicos', [
      {
        nombre: 'ESTUDIANTE',
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: 'TÉCNICO MEDIO',
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: 'TÉCNICO SUPERIOR',
        createdAt: now,
        updatedAt: now,
      },

      {
        nombre: 'LICENCIATURA',
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: 'ESPECIALIZACIÓN',
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: 'MAESTRÍA',
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: 'DOCTORADO / PH.D.',
        createdAt: now,
        updatedAt: now,
      },

      {
        nombre: 'DIPLOMADO',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('niveles_academicos', null, {});
  },
};
