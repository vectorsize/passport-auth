const passport = require('passport')

function initUser (app) {
  app.get('/', renderWelcome)
  app.get('/profile', passport.authenticationMiddleware(), renderProfile)
  app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), setCookie)
  app.get('/logout', passport.authenticationMiddleware(), logOut)
}

function setCookie (req, res) {
  res.cookie('user', JSON.stringify({
    name: 'karl'
  }), { maxAge: 900000, httpOnly: false })
  res.redirect('/profile')
}

function renderWelcome (req, res) {
  res.render('user/welcome')
}

function renderProfile (req, res) {
  res.render('user/profile', {
    username: req.user.username
  })
}

function logOut (req, res) {
  req.logout()
  req.session.destroy(function (err) {
    // reset cookie
    res.cookie('user', null, { maxAge: 0, httpOnly: false })
    res.render('user/welcome')
  })
}

module.exports = initUser
