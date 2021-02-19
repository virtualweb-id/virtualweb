'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invitations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      WeddingId: {
        type: Sequelize.INTEGER
      },
      brigeNickname: {
        type: Sequelize.STRING
      },
      groomNickname: {
        type: Sequelize.STRING
      },
      story: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      backgroundImg: {
        type: Sequelize.STRING
      },
      additionalImg: {
        type: Sequelize.STRING
      },
      videoUrl: {
        type: Sequelize.STRING
      },
      backgroundColor: {
        type: Sequelize.STRING
      },
      textColor: {
        type: Sequelize.STRING
      },
      timeEvent1: {
        type: Sequelize.STRING
      },
      timeEvent2: {
        type: Sequelize.STRING
      },
      youtubeUrl: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Invitations');
  }
};