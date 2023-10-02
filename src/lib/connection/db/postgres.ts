import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  host: "localhost",
  dialect: "postgres",
  port: 5433,
  username: "postgres",
  password: "adrian",
  database: "postgres",
});
console.log("db connected too :D");
// console.log(sequelize);
