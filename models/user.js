'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

/* 
    EXMPLIFYING MODEL LEVEL VALIDATION
*/
module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A name is required'
        },
        notEmpty: {
          msg: "Please provide a name"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "The email you entered already exists"
      },
      validate: {
        notNull: {
          msg: 'An email is required'
        },
        notEmpty: {
          msg: "Please provide an email"
        },
        isEmail: {
          msg: "Please provide a valid email"
        }
      }
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A birthday is required'
        },
        notEmpty: {
          msg: "Please provide a birthday"
        }, 
        isDate: {
          msg: "Birthday must be a valid date"
        }
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: "Please provide a password"
        },
        len: {
          args: [8, 20],
          msg: "Password should be between 8-20 characters in length"

        }
      }
    },
    confirmedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if (val === this.password) {
          const hashedPassword = bcrypt.hashSync(val, 10)
          // Sequelize will call this setter and run the hash before persisting to DB
          this.setDataValue('confirmedPassword', hashedPassword)
        }
      },
      validate: {
        notNull: {
          msg: "Both passwords must match"
        }
      }
    }
  }, { sequelize });

  return User;
};