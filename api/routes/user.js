const express = require('express');
const router = express.Router();
const md5 = require('md5');

// model import!
let User = require('../../models/user.model');

router.get('/:id',(req,res) => {
    const id = req.params.id;
    res.status(200).json({
        message: 'You get user data!',
        userId: id
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
                const hashedPassword = md5(password);

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

router.post('/login',(req,res) => {
    const { email, password } = req.body;
    var errorCount  = 0;

    if(!email || !password) {
        res.json({
            status: false,
            message: 'Please fill all the details!'
        })
        errorCount = errorCount + 1;
    }

    // check if user exists!
    User.findOne({email: email})
    .then(user => {
        const dbPassword = user.password;
        const encPassword = md5(password);
        if(user) {
            if(dbPassword === encPassword) {
                res.json({
                    status: true,
                    message: 'Logged in succesfully!',
                    userId: user.id
                })
            } else {
                res.json({
                    status: false,
                    message: 'Password is invalid'
                })
            }
        } else {
            res.json({
                status: false,
                message: 'No such user exists!'
            })
        }
    })
})

module.exports = router;
