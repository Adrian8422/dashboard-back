import { Sequelize } from "sequelize";
const url = process.env.DATABASE_URL as string;

console.log("can i see?", url);
export const sequelize = new Sequelize(url, {
  dialect: "postgres",
});
// export const sequelize = new Sequelize({
//   host: "localhost",
//   dialect: "postgres",
//   port: 5433,
//   username: "postgres",
//   password: "adrian",
//   database: "postgres",
// });
console.log("db connected too :D");
// console.log(sequelize);
