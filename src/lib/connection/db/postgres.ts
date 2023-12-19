import { Sequelize } from "sequelize";
const url = process.env.DATABASE_URL as string;

console.log("can i see?", url);
export const sequelize = new Sequelize(url, {
  dialect: "postgres",
});
console.log("db connected too :D");
// console.log(sequelize);
