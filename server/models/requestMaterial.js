'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MaterialRequest.belongsTo(models.Material, { foreignKey: "materialId" });
      MaterialRequest.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  MaterialRequest.init({
    materialId: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate : {
        notEmpty : {
          msg: "material id is required"
        },
        notNull : {
          msg : "material id is required"
        }
      }
    },
    quantity: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate : {
        notEmpty : {
          msg: "quantity is required"
        },
        notNull : {
          msg : "quantity is required"
        }
      }
    },
    status: {
      type : DataTypes.STRING,
      allowNull: false,
      defaultValue: "submitted",
      validate : {
        notEmpty : {
          msg: "status is required"
        },
        notNull : {
          msg : "status is required"
        }
      }
    },
    reasonRevise: {
      type : DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate : {
        notEmpty : {
          msg: "user id is required"
        },
        notNull : {
          msg : "user id is required"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'MaterialRequest',
  });
  return MaterialRequest;
};