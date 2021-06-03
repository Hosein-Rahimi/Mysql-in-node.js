require('dotenv').config({ path: '../../.env' })
const mysql = require("mysql");

class MySqlService {
  dbCreate;
  tableCreate;
  tableDel;
  setTableCreate(tableCreate) {
    this.tableCreate = tableCreate;
  }
  getTableCreate() {
    return this.tableCreate;
  }
  getTableDel() {
    return this.tableDel;
  }
  setTableDel(tableDel) {
    this.tableDel = tableDel;
  }
  setDbCreate(dbCreate) {
    this.dbCreate = dbCreate;
  }
  getDbCreate() {
    return this.dbCreate
  }


  dbCreateService() {
    var con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    con.query(
      ` CREATE DATABASE IF NOT EXISTS ${this.getDbCreate()} `,
      (error, result) => {
        if (error) throw error;
        console.log(`Db created.`);
      }
    );
    con.end();
  }

  tableCreateService() {
    var con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    con.query(
      `CREATE TABLE IF NOT EXISTS ${this.getTableCreate()}`,
      (error, result) => {
        if (error) throw error;
        console.log(`table ${this.getTableCreate()} crated. `);
      }
    );
    con.end();
  }

  tableDeleteService() {
    var con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    con.query(
      `DROP TABLE IF EXISTS ${this.getTableDel()}`,
      function (err, result) {
        if (err) throw err;
        console.log(result);
      }
    );
    con.end();
  }
}
module.exports = MySqlService;
