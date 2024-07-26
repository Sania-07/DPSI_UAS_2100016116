const { Sequelize } = require('sequelize');

require('dotenv').config();

// Konfigurasi koneksi Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectModule: require('mysql2')
});

const ServiceOrder = require('./ServiceOrder')(sequelize);
const ServiceStatus = require('./ServiceStatus')(sequelize);
const User = require('./user')(sequelize);

// Definisikan asosiasi
ServiceOrder.belongsTo(User, { foreignKey: 'user_id' });
ServiceStatus.belongsTo(ServiceOrder, { foreignKey: 'order_id' });

// Sinkronkan model dengan database
sequelize.sync()
  .then(() => {
    console.log('Database tersinkronisasi');
  })
  .catch(err => {
    console.error('Error saat sinkronisasi database:', err);
  });

module.exports = {
  sequelize,
  ServiceOrder,
  ServiceStatus,
  User,
};
