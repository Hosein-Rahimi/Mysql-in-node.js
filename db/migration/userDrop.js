var MySqlService = require("./MySqlService");
let connect = new MySqlService();

connect.setTableDel("users");
connect.tableDeleteService();
