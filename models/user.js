'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      setPassword: function(password, callback) {
        // Pseudo, i don't actually know the bcrypt api
        return bcrypt.hash(password, bcrypt.genSaltSync(8), callback);
      }
    },

    instanceMethods: {
      verifyPassword: function(password, callback) {
        bcrypt.compare(password, this.password, callback);
      }
    }
  });
  return User;
};