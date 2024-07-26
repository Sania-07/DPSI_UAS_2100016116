const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ServiceOrder', {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    service_status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'ServiceOrders',
    timestamps: false,
    classMethods: {
      createOrder: function () {
        // Implementasi metode createOrder
      },
      validateOrder: function () {
        // Implementasi metode validateOrder
      }
    }
  });
};
