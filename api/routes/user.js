const express = require('express');
const router = express.Router();
const md5 = require('md5');

// model import!
let User = require('../../models/user.model');

// to get the user details!
router.get('/:id',(req,res) => {
    const id = req.params.id;
    
    User.findOne({_id: id})
    .then(user => {
        if(user) {
            const userDetails = {
                name: user.username,
                email: user.email
            }

            res.json({
                status: true,
                message: 'User found',
                user: userDetails
            })
        } else {
            res.json({
                status: false,
                message: 'Unable to find user!'
            })
        }
    })
    .catch(err => console.log(err));
});

// register an user!
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
        User.findOne({email: email}) // SELECT * FROM WHERE `email` = '$email';
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

                // change newuser password to hashedpassword!
                newUser.password = hashedPassword;

                newUser.save() // --> INSERT in sql!
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

// login user!
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
        if(user) {
            const dbPassword = user.password;
            const encPassword = md5(password);
            if(dbPassword === encPassword) {
                res.json({
                    status: true,
                    message: 'Logged in succesfully!',
                    userId: user._id
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


// edit user details!
router.get('/editUser/:id',(req,res) => {
    const id = req.params.id;
    const { email, username } = req.body;
    var errorCount = 0;

    // if fields are not present!
    if(!email || !username ) {
        res.json({
            status: false,
            message: 'Please fill all the details!'
        })

        errorCount = errorCount + 1;
    }

    // check if error is there!
    if(errorCount > 0) {
        res.json({
            status: false,
            message: 'Please check again!'
        })
    } else {
        User.findOne({_id: id}) 
        .then(user => {
            if(user) {
                user.email = email;
                user.username = username;
                user.save()
                .then(() => {
                    res.json({
                        status: true,
                        message: 'User details changed!'
                    });
                })
                .catch(err => console.log(err))
                
            } else {
                res.json({
                    status: false,
                    message: 'User does not exist!'
                })
            }
        }).catch(err => console.log(err));  
    }
})

//change user password
router.get('/changePassword/:id', (req,res) => {
    const id = req.params.id;
    const {newPassword, oldPassword} = req.body;
    var errorCount = 0;

    //if fields are empty
    if(!newPassword || !oldPassword){
        res.json({
            status: false,
            message: 'Enter both passwords'
        })
        errorCount += 1;
    }

    //check for error
    if(errorCount > 1){
        res.json({
            status: false,
            message: "Enter again"
        })
    }else{
        hashedNewPass = md5(newPassword);
        hashedOldPass = md5(oldPassword);
        User.findOne({id: id})
        .then(user => {
            if(hashedOldPass === user.password){
                user.password = hashedNewPass;
                user.save()
                .then(() => {
                    res.json({
                        status: true,
                        message: "User password changed!"
                    })
                })
                .catch(err => console.log(err));
            }else{
                res.json({
                    status: false,
                    message: "Incorrect Password"
                })
            }
        })
        .catch(err => console.log(err));
    }
})

module.exports = router;
