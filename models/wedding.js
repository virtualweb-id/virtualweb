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
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Title is required' }
      }
    },
    date: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: { msg: 'Date is required' },
        chosen(date) {
          let today = new Date();
          const dd = String(today.getDate()).padStart(2, '0');
          const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          const yyyy = today.getFullYear();

          today = yyyy + '-' + mm + '-' + dd

          const myDate = new Date(date)
          const newDate = new Date(today)

          if (myDate < newDate) {
            throw new Error('Please choose the date wisely. It must be greater than today')
          }
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Address is required' }
      }
    },
    groomName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Groom's Name is required` }
      }
    },
    brideName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Bride's Name is required` }
      }
    },
    groomImg: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Groom's Photo is required` }
      }
    },
    brideImg: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Bride's Photo is required` }
      }
    },
    status: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wedding',
  });
  return Wedding;
};