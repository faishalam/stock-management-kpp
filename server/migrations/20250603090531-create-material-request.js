"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MaterialRequests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      materialId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Materials",
          key: "id",
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      status: {
        defaultValue: "submitted",
        type: Sequelize.STRING,
      },
      reasonRevise: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MaterialRequests");
  },
};
