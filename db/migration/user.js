var MySqlService = require("./MySqlService");
let connect = new MySqlService();

connect.setDbCreate("mydb")

connect.setTableCreate(
  "users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(33), username VARCHAR(33), email VARCHAR(40))"
);

connect.dbCreateService();
connect.tableCreateService();
