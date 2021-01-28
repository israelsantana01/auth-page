const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '192.185.176.115',
  user: 'marol456_gestor',
  password: '!TwHt3(IddRb',
  database: 'marol456_dtgestorweb'
});

app.post('/register', (req, res) => {
  const { name, password } = req.body;

  db.query(
    'INSERT INTO users (name, password) VALUES (?,?)', 
    [name, password], 
    (err, result) => {
      console.log(err);
    }
  );
});

app.post('/login', (req, res) => {
  const { name, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE name = ? AND password = ?', 
    [name, password], 
    (err, result) => {
      if (err) res.send({ err: err });

      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({message: 'Wrong name/password combination!'});
      }
    }
  );
});

app.listen(3001, () => {
  console.log('running server...');
});