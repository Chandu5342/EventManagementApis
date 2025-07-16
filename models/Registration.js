const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Event = require('./Event.');

// Define the join table
const Registration = sequelize.define('Registration', {}, { timestamps: false });

// Define relationships
User.belongsToMany(Event, { through: Registration });
Event.belongsToMany(User, { through: Registration });

module.exports = Registration;
