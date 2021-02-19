'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wedding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wedding.belongsTo(models.User)
      Wedding.hasOne(models.Invitation)
    }
  };
  Wedding.init({
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    address: DataTypes.STRING,
    groomName: DataTypes.STRING,
    brideName: DataTypes.STRING,
    groomImg: DataTypes.STRING,
    brideImg: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wedding',
  });
  return Wedding;
};