require('dotenv').config();
var Sequelize = require('sequelize');
var sequelizeTransforms = require('sequelize-transforms');

// Override timezone formatting
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);
  
    // Z here means current timezone, _not_ UTC
    // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
    return date.format('YYYY-MM-DD HH:mm:ss.SSS');
  };

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 60000
    },
    host: process.env.DATABASE_HOST,
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