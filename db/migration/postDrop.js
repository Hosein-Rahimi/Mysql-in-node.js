var MySqlService = require("./MySqlService");
let connect = new MySqlService();

connect.setTableDel("posts");
connect.tableDeleteService();
