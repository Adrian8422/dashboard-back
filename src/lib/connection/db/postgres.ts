import { Sequelize } from "sequelize";
const url = process.env.DATABASE_URL as string;
console.log("que carajos", url);
// const urlString =
//   "postgres://admin:LbvnroKYiVdtQSPqdgI6pAHzLPzhnS2i@dpg-cp3eqjfsc6pc73fnh66g-a/dbdash_qvhv";
// console.log("llega?", process.env.DATABASE_URL);
// console.log("can i see?", url);
export const sequelize = new Sequelize(url, {
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    supportBigNumbers: true,
    ssl: {
      rejectUnauthorized: false, // Trust the self-signed certificate
    },
  },
});
// export const sequelize = new Sequelize({
//   host: "localhost",
//   dialect: "postgres",
//   port: 5432,
//   username: "postgres",
//   password: "adrian",
//   database: "postgres",
// });
console.log(sequelize, "db connected too :D");
// sequelize.sync();
// console.log(sequelize);
