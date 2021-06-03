var MySqlService = require("./MySqlService");
let connect = new MySqlService();

connect.setDbCreate("mydb")

connect.setTableCreate(
  "posts (userId INT, id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(87), body VARCHAR(255))"
);

connect.dbCreateService();
connect.tableCreateService();
