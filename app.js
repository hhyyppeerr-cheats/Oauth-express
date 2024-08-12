require('dotenv').config();
const express = require('express');
const passport = require('./config/passport');
const app = express();

// Middleware de Express para Passport
app.use(require('cookie-parser')());
app.use(require('express-session')({ 
  secret: 'secreto', 
  resave: true, 
  saveUninitialized: true, 
  cookie: { 
    secure: false, 
    maxAge: null 
  } 
}));
//app.use(passport.initialize());
app.use(passport.session());

// Cargar las rutas
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/secret', require('./routes/secret'));

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
