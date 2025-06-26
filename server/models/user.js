"use strict";
const { Model } = require("sequelize");
const { genSalt } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Stock, { foreignKey: "userId" });
      User.hasMany(models.Material, { foreignKey: "userId" });
      User.hasMany(models.MaterialRequest, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "username is requried",
          },
          notNull: {
            msg: "username is required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "email is requried",
          },
          notNull: {
            msg: "email is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "email is requried",
          },
          notNull: {
            msg: "email is required",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          notEmpty: {
            msg: "role is requried",
          },
          notNull: {
            msg: "role is required",
          },
        },
      },
      areaKerja: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Area kerja is requried",
          },
          notNull: {
            msg: "Area kerja is required",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate(instance, option) {
          instance.password = genSalt(instance.password);
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
