const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');

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
        if (err) console.log(err);
      }
    );
  });
});

function verifyJWT(req, res, next) {
  const bearerToken = req.headers['x-access-token'];
  const token = bearerToken.split(' ')[1];

  if (!token) {
    res.send('Yo, we need a token, please give it to us next time!');
  } else {
    jwt.verify(token, 'jwtSecret', (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: err })
      } else {
        req.userId = decoded.id;
        next();
      }
    })
  }
}

app.get('/isUserAuth', verifyJWT, (req, res) => {
  res.send('Yo, u are authenticated Congrats!');
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
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
      if (err) res.send({ message: err });

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (err, response) => {
          if (response) {
            const id = result[0].id;
            const token = jwt.sign({id}, 'jwtSecret', {
              expiresIn: 300,
            });
            req.session.user = result;
 
            res.json({ auth: true, token: token, result: result });
          } else {
            res.send({ auth: false, message: err });
          }
        });
      } else {
        res.json({ auth: false, message: err });
      }
    }
  );
});

app.listen(3001, () => {
  console.log('Running server on: http://localhost:3001');
});