'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Weddings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      address: {
        type: Sequelize.STRING
      },
      groomName: {
        type: Sequelize.STRING
      },
      brideName: {
        type: Sequelize.STRING
      },
      groomImg: {
        type: Sequelize.STRING
      },
      brideImg: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
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
    await queryInterface.dropTable('Weddings');
  }
};