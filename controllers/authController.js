const User = require('../models/user');
const { genAccessToken } = require('../utils/genAccessToken');
const { v4: uuidv4 } = require('uuid');

exports.signup = async (req, res) => {
  
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      error: 'User already exists',
    });
  }
  let salt = uuidv4();
  let accesToken = genAccessToken(email + password, salt);
  const user = await User.create({
    name,
    email,
    password,
    salt,
    accesToken
  });


  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accesToken: user.accesToken,
    });
  } else {
    return res.status(400).json({
      error: 'User not found',
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  //check if User exits
  const user = await User.findOne({ email });

  //authenticate
  if (user && (await user.authenticate(password))) {
    let newAccessToken = genAccessToken(email + password, user.salt);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accesToken: newAccessToken,
    });
  } else {
    return res.status(400).json({
      error: 'Invalid Email or Password',
    });
  }
};

// exports.updateUser = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.pic = req.body.pic || user.pic;
//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     const updatedUser = await user.save();
//     let newAccessToken = genAccessToken(email + password, updatedUser.salt);
//     res.cookie('accesToken', newAccessToken, { expiresIn: '1d' });
  
//     res.status(201).json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//       accesToken: newAccessToken,
//     });
//   } else {
//     res.status(404);
//     throw new Error('User Not Found');
//   }
// };

exports.signout = (req, res) => {
  res.json({
    message: 'Signout !',
  });
};

//   exports.requireSignin = expressJwt({
//     secret: process.env.JWT_SECRET, algorithms: ['HS256']
//   });

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    if (user.role !== 1) {
      return res.status(400).json({
        error: 'Admin resource. Access denied',
      });
    }
    req.profile = user;
    next();
  });
};
