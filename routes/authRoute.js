const express = require('express');
const router = express.Router();
const { signup,signin,signout } = require('../controllers/authController');

//validators
//const { runValidation } = require('../validators/index');
const { userSignupValidator,userSigninValidator } = require('../validators/authValidator');

router.post('/signup',userSignupValidator, signup);
router.post('/signin',userSigninValidator, signin);
router.get('/signout',signout);

//test
router.get('/secret',(req,res)=>{
    res.json({message:'dsds'})
})
module.exports = router;
