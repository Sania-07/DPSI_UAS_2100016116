const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ServiceStatus', {
    status_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ServiceOrders', // Harus sesuai dengan nama tabel yang digunakan di model ServiceOrder
        key: 'order_id'
      }
    },
    status_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ServiceStatus',
    timestamps: false,
    classMethods: {
      updateStatus: function () {
        // Implementasi metode updateStatus
      }
    }
  });
};
