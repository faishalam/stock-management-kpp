"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Material.hasMany(models.Stock, { foreignKey: "materialId" });
      Material.hasMany(models.MaterialRequest, { foreignKey: "materialId" });
      Material.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Material.init(
    {
      materialName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "material name is required",
          },
          notEmpty: {
            msg: "material name is required",
          },
        },
      },
      materialNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      satuan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "satuan is required",
          },
          notEmpty: {
            msg: "satuan is required",
          },
        },
      },
      limited: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalStock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "user id is required",
          },
          notEmpty: {
            msg: "user id is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Material",
    }
  );
  return Material;
};
