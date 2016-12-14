module.exports = db => {
  return {
    requireAuthentication: (req, res, next) => {
      let token = req.get('Auth')

      db.user.findByToken(token)
        .then(
          user => {
            req.user = user
            next()
          },
          e => res.status(401).send()
        )
    }
  }
}
