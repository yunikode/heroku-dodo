const bcrypt = require('bcrypt')
const _ = require('underscore')
const cryptojs = require('crypto-js')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
  let user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salt: {
      type: DataTypes.STRING
    },
    password_hash: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [7, 100],
        isAlphanumeric: true
      },
      set: function(value) {
        let salt = bcrypt.genSaltSync(10)
        let hashedPassword = bcrypt.hashSync(value, salt)

        this.setDataValue('password', value)
        this.setDataValue('salt', salt)
        this.setDataValue('password_hash', hashedPassword)
      }
    }
  }, {
    hooks: {
      beforeValidate: (user, options) => {
        if (typeof user.email === 'string') {
           user.email = user.email.toLowerCase()
        }
      }
    },
    classMethods: {
      authenticate: (body) => {
        return new Promise( (resolve, reject) => {
          if (typeof body.email !== 'string' || typeof body.password !== 'string') {
            return reject()
          }

          user.findOne({
            where: {
              email: body.email
            }
          })
            .then( user => {
              if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                return reject()
              }

              resolve(user)
            }, e => reject() )
        })
      },
      findByToken: (token) => {
        return new Promise( (resolve, reject) => {
          try {
            let decodedJWT = jwt.verify(token, 'qwerty098')
            let bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#')

            let tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8))

            user.findById(tokenData.id)
              .then(
                user => {
                  user
                  ? resolve(user)
                  : reject()
                },
                e => reject()
              )
          } catch (e) {
            reject()
          }
        })
      }
    },
    instanceMethods: {
      toPublicJSON: function () {
        let json = this.toJSON()
        return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt')
      },
      generateToken: function (type) {
        if (!_.isString(type)) {
          return undefined
        }

        try {
          let stringData = JSON.stringify({id: this.get('id'), type: type})
          let encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#').toString()
          let token = jwt.sign({
            token: encryptedData,
          }, 'qwerty098')

          return token
        } catch (e) {
          return undefined
        }
      }
    }
  })

  return user
}
