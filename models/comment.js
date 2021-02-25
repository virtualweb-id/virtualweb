'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Invitation)
    }
  };
  Comment.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Name is required' }
      }
    },
    relationship: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Relationship is required' }
      }
    },
    message: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Message is required' }
      }
    },
    InvitationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};