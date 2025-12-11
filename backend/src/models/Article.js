const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Article = sequelize.define("Article", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    origin: {
        // Marks whether the post came from a user prompt or the automated daily job
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
            isIn: [["user", "automated"]],
        },
    }
});

module.exports = Article;
