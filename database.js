import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize("mysql://root@127.0.0.1:3306/js_mini_project");
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export const AlcoholicDrink = sequelize.define("alcoholic_drinks", {
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1023),
    allowNull: false,
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  evaluatedPrice: {
    type: DataTypes.FLOAT.UNSIGNED,
  },
  alcoholLevel: {
    type: DataTypes.INTEGER.UNSIGNED,
  },
});
AlcoholicDrink.sync();
