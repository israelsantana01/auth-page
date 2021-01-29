const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  key: 'userId',
  secret: 'subscribe',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expire: 60 * 60 * 24,
  }
}));

app.use(express.json());

const db = mysql.createConnection({
  host: '192.185.176.115',
  user: 'marol456_gestor',
  password: '!TwHt3(IddRb',
  database: 'marol456_dtgestorweb'
});

app.post('/register', (req, res) => {
  const { name, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) console.log(err);

    db.query(
      'INSERT INTO users (name, password) VALUES (?,?)', 
      [name, hash], 
      (err, result) => {
        console.log(err);
      }
    );
  });
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post('/login', (req, res) => {
  const { name, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE name = ?', 
    name, 
    (err, result) => {
      if (err) res.send({ err: err });

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (err, response) => {
          if (response) {
            req.session.user = result;
            console.log(req.session.user);
            res.send(result);
          } else {
            res.send({message: 'Wrong name/password combination!'});
          }
        });
      } else {
        res.send({message: "User doesn't exist "});
      }
    }
  );
});

app.listen(3001, () => {
  console.log('running server...');
});