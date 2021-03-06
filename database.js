import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize("mysql://root@127.0.0.1:3306/js_mini_project");
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export const AlcoholicDrink = sequelize.define("alcoholic_drinks", {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1023),
    allowNull: false,
  },
  estimatedPrice: {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
  },
  alcoholLevel: {
    type: DataTypes.FLOAT.UNSIGNED,
  },
});
AlcoholicDrink.sync();
