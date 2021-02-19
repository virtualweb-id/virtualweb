'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      relationship: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      WeddingId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Weddings',
          key: "id"
        },
        onDelete: 'cascade',
        onUPdate: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comments');
  }
};