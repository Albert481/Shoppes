require('dotenv').config();
var Sequelize = require('sequelize');
var sequelizeTransforms = require('sequelize-transforms');

const inDevMode = process.env.NODE_ENV === "DEV";

var DATABASE_NAME = "shoppes";
var DATABASE_USERNAME = "root";
var DATABASE_PASSWORD = "1234";
var DATABASE_HOST = "localhost";

if (!inDevMode) {
    DATABASE_NAME = process.env.DATABASE_NAME
    DATABASE_USERNAME = process.env.DATABASE_USERNAME
    DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
    DATABASE_HOST = process.env.DATABASE_HOST
}

// Override timezone formatting
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);
  
    // Z here means current timezone, _not_ UTC
    // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
    return date.format('YYYY-MM-DD HH:mm:ss.SSS');
  };

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 60000
    },
    host: DATABASE_HOST,
    pool: {
        min: 0,
        max: 10,
        idle: 10000
      }
  });

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

sequelizeTransforms(sequelize);

module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;