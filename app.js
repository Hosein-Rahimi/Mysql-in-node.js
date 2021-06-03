let express = require("express");
let mysql = require("mysql");
let axios = require("axios");
let redis = require("redis");
const bodyParser = require("body-parser");
require("dotenv").config();
let WebService = require("./WebServices");
let app = express();
let client = redis.createClient();
app.use(bodyParser.json());
const port = 8000;

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

client.on("connect", () => {
  console.log("Connected to Redis...");
});

app.get("/posts", async (req, res) => {
  let webService = new WebService();
  await client.get(process.env.FAKE_API_URL + "posts", async (error, obj) => {
    if (!obj) {
      await webService
        .setUrl(process.env.FAKE_API_URL + "posts")
        .setHeaders()
        .setBody()
        .setParams()
        .send();
      let value = JSON.stringify(webService.getResult())
      client.set(process.env.FAKE_API_URL + "posts", [value], (err, reply) => {
        return res.status(webService.getStatusCode()).json(webService.getResult())
      })
    } else {
      obj = JSON.parse(obj);
      return res.send(obj);
    }
  })
})

app.get("/posts/update", async (req, res) => {
  let webService = new WebService();
  await webService
    .setUrl(process.env.FAKE_API_URL + "posts")
    .setHeaders()
    .setBody()
    .setParams()
    .send();
  for (let item of webService.getResult()) {
    con.query(`INSERT INTO posts (id, userId, title, body) VALUES (${item.id},${item.userId},"${item.title}","${item.body}")`,
      (err, result) => {
        if (err) throw err;
        console.log(result)
      })
  }
  return res.status(webService.getStatusCode()).json("Successfully inserted :)")
});

app.get("/users/update", async (req, res) => {
  let webService = new WebService();
  await webService
    .setUrl(process.env.FAKE_API_URL + "users")
    .setHeaders()
    .setBody()
    .setParams()
    .send();
  for (let item of webService.getResult()) {
    con.query(`INSERT INTO users (id, name, username , email) VALUES (${item.id},'${item.name}','${item.username}','${item.email}')`,
      (err, result) => {
        if (err) throw err
        console.log(result)
      })
  }
  return res.status(webService.getStatusCode()).json("Successfully inserted :)")
});

app.get("/users/all", async (req, res) => {
  await con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    return res.status(200).json(result);
  });
});

app.get("/posts/all", async (req, res) => {
  await con.query("SELECT * FROM posts", function (err, result, fields) {
    if (err) throw err;
    return res.status(200).json(result);
  });
});

app.get("/users/id/:id", async (req, res) => {
  await con.query(
    `SELECT * FROM users WHERE id = ${req.params.id}`,
    function (err, result) {
      if (err) throw err;
      if (result == 0)
        return res.status(404).json(`User by Id ${req.params.id} not found.`)

      return res.status(200).json(result);
    });
});

app.get("/posts/id/:id", async (req, res) => {
  await con.query(
    `SELECT * FROM posts WHERE id = '${req.params.id}'`,
    (err, result) => {
      if (err) throw err;
      return res.status(200).json(result);
    }
  );
});

app.get("/users/", async (req, res) => {
  await con.query(
    `SELECT * FROM users WHERE name LIKE '%${req.query.name}%'`,
    (err, result) => {
      if (err) throw err;
      if (result == 0)
        return res.status(404).json(`User by name ${req.query.name} not found.`)

      return res.status(200).json(result);
    });
});

app.get("/posts/", async (req, res) => {
  await con.query(
    `SELECT * FROM posts WHERE title LIKE '%${req.query.title}%'`,
    (err, result) => {
      if (err) throw err;
      return res.status(200).json(result);
    }
  );
});

app.get("/users/sort/", (req, res) => {
  con.query(
    `SELECT * FROM users ORDER BY ${req.query.sortby}`,
    function (err, result) {
      if (err) throw err;
      return res.status(200).json(result);
    }
  );
});

app.delete("/users/delete/:id", (req, res) => {
  con.query(
    `DELETE FROM users WHERE id = ${req.params.id}`,
    function (err, result) {
      if (err) throw err;
      return res.status(200).json(`User by id ${req.params.id} deleted.`);
    }
  );
});

app.delete("/users/delete/", (req, res) => {
  con.query(
    `DELETE FROM users WHERE name = '${req.query.name}'`,
    function (err, result) {
      if (err) throw err;
      return res.status(200).json(`User by id ${req.query.name} deleted.`);
    }
  );
});

app.put("/users/update/:id", async (req, res) => {
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;
  let postId = req.body.postId
  let id = req.params.id;
  let query = `UPDATE users SET name = '${name}', username = '${username}', email = '${email}' WHERE users.id = '${id}'`;

  await con.query(query, (err, result) => {
    if (err) throw err;
    return res.send(result);
  });
});

app.get("/users/get/limit", (req, res) => {
  con.query(
    `SELECT * FROM users LIMIT ${req.query.limit}`,
    function (err, result) {
      if (err) throw err;
      return res.status(200).json(result);
    }
  );
});

app.get("/users/join", async (req, res) => {
  await con.query(
    "SELECT posts.body AS body, users.name AS name FROM posts JOIN users ON posts.userId = users.id",
    function (err, result) {
      if (err) throw err;
      return res.status(200).json(result);
    }
  );
});

app.listen(port, () => {
  console.log(`Run at address http://localhost:${port}`);
});
