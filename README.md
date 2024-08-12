Necesitaremos las siguientes librerias para usar Oauth:

- cookie-parser
- dotenv
- express-session
- passport
- passport-github2

# Crear Token de Acceso

Ve a Settings -> Developer settings -> OAuth Apps -> New OAuth App.

Crea un nuevo token, te darán un Client ID y un Client Secret.

Almacenalos en un archivo .env en la raiz de tu proyecto:

```
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```

# Configurar Passport

La configuración de passport la haremos en un archivo aparte, en este caso `config/passport.js`:

```javascript
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, 
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
```

# Configurar Express

En el archivo `app.js` configuramos express para usar passport:

```javascript
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
```