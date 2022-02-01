const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    accesToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//virtual fields
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
   // this.salt = uuidv4();
    this.hashed_password = this.encryptString(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptString(plainText) === this.hashed_password;
  },

  encryptString: function (strToEncode) {
    if (!strToEncode) return '';
    try {
      return crypto
        .createHmac('sha256', this.salt)
        .update(strToEncode)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

module.exports = mongoose.model('User', userSchema);
