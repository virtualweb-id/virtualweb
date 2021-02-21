'use strict';
const {
  Model
} = require('sequelize');
const { hashPwd } = require('../helpers')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Wedding)
      User.hasMany(models.Guest)
    }
  };
  User.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Name is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Email/password is not valid'
        },
        notEmpty: {
          msg: 'Email is required'
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Phone number is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5],
          msg: 'Password must be at least 5 characters'
        },
        notEmpty: {
          msg: 'Password is required'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (instance, options) => {
        instance.password = hashPwd(instance.password)
      }
    }
  });
  return User;
};