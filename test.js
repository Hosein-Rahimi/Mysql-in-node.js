var mysql = require("mysql");
let express = require("express");
const bodyParser = require("body-parser");
let app = express();
const port = 3030;
app.use(bodyParser.json());
require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.get("/users/id/:id", async (req, res) => {

    await con.query(
      `SELECT * FROM users WHERE id = ${req.params.id}`,
      function (err, result) {
        if (err) throw err;
        if (result == 0)
          return res.status(404).json(`User by Id ${req.params.id} not found.`)

        return res.status(200).json(result);
      }
    );
    
});

app.get("/users/", async (req, res) => {
  await con.query(
    `SELECT * FROM users WHERE name = '%${req.query.name}%'`,
    (err, result) => {
      if (err) throw err;
      if(result == 0)
      return res.status(404).json(`User by name ${req.query.name} not found.`)

      return res.status(200).json(result);
    }
  );
});

app.listen(port, () => {
  console.log(`Run at address http://localhost:${port}`);
});
