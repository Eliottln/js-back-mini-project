import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://root:root@127.0.0.1:3306/tpjs')
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export const Task = sequelize.define('Task', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.BOOLEAN
    }
});
Task.sync();