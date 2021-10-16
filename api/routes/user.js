const express = require('express');
const router = express.Router();
const argon2 = require('argon2');

// model import!
let User = require('../../models/user.model');

router.get('/',(req,res) => {
    res.status(200).json({
        message: 'You get user data!'
    })
});

router.post('/register',(req,res) => {
    const { email,username,password } = req.body;
    var errorCount = 0;

    // if fields are not present!
    if(!email || !username || !password) {
        res.json({
            status: false,
            message: 'Please fill all the details!'
        })

        errorCount = errorCount + 1;
    }

    // check password length!
    if(password.length < 6) {
        res.json({
            status: false,
            message: 'Password length should be more than or equal to 6!'
        })

        errorCount = errorCount + 1;
    }

    // check if error is there!
    if(errorCount > 0) {
        res.json({
            status: false,
            message: 'There are some errors with the data you entered!'
        })
    } else {
        User.findOne({email: email})
        .then(user => {
            if(user) {
                res.json({
                    status: false,
                    message: 'User already exists!'
                })
            } else {
                const newUser = new User({
                    email,
                    username,
                    password
                })

                // hashing password!
                const hashedPassword = await argon2.hash(password);

                newUser.password = hashedPassword;

                newUser.save()
                .then(() => {
                    res.json({
                        status: true,
                        message: 'User registered!'
                    })
                })
                .catch(err => console.log(err));
            }
        }) 
    }

})

module.exports = router;
