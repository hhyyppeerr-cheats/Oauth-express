require('dotenv').config()
const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const path = require('path');
const app = express();
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
// Configurar Passport
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Aquí podrías almacenar el perfil del usuario en tu base de datos
    return done(null, profile);
  }
));

// Serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

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

app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.get('/profile', ensureAuthenticated, (req, res) => {
  // Acceder al nombre de usuario desde req.user
  res.json(req.user);
});

app.get('/secret', ensureAuthenticated, (req, res) => {
  res.send('Secretitos solo disponibles para usuarios autenticados');
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
