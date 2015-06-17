'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      password: {
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

    var User = require('../models').User;
    User.setPassword('admin@123$%^', function(err, password) {
      if (err) return;
      User.create({
        email: 'admin@taskmanager.com',
        firstName: 'admin',
        lastName: 'admin',
        password: password
      });
    });
    return
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};