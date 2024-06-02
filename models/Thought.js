const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const User = require("./User");

const thought = db.define("thought", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
});

thought.belongsTo(User);
User.hasMany(thought);

module.exports = thought;
