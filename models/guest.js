'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Guest.belongsTo(models.User)
    }
  };
  Guest.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Name is required' }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Email is required' }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Phone number is required' }
      }
    },
    status: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Guest',
  });
  return Guest;
};