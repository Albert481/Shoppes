// models/users.js
var myDatabase = require('../controllers/database/mysql');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Users = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fname: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    lname: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    bio: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    address: {
        type: Sequelize.STRING,
        defaultValue: ""
    },    
    accstatus: {
        type: Sequelize.STRING,
        defaultValue: "active"
    },
    usrstatus: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
});

// force: true will drop the table if it already exists
Users.sync({force: true, logging:console.log}).then(()=>{
    console.log("users table synced");
    // Users.upsert({
    //     user_id: 1,
    //     fname: 'Albert',
    //     lname: 'Yu',
    //     email: 'albertyu481@gmail.com',
    //     password: '1234',
    //     bio: "selling shoes",
    //     address: "481 Sembawang 1",
    // })
    Users.upsert({
        user_id: 1,
        fname: 'Aaron',
        lname: 'Lam',
        email: 'aaron@gmail.com',
        password: '1234',
        bio: "selling shoes",
        address: "Hougang 1"
    })
    Users.upsert({
        user_id: 2,
        fname: 'Angelica',
        lname: 'Pena',
        email: 'angelica@gmail.com',
        password: '1234',
        bio: "selling shoes",
        address: "Hougang 1"
    })
});

module.exports = sequelize.model('Users', Users);