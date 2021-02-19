'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Invitation.init({
    WeddingId: DataTypes.INTEGER,
    brigeNickname: DataTypes.STRING,
    groomNickname: DataTypes.STRING,
    story: DataTypes.STRING,
    title: DataTypes.STRING,
    backgroundImg: DataTypes.STRING,
    additionalImg: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    backgroundColor: DataTypes.STRING,
    textColor: DataTypes.STRING,
    timeEvent1: DataTypes.STRING,
    timeEvent2: DataTypes.STRING,
    youtubeUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Invitation',
  });
  return Invitation;
};