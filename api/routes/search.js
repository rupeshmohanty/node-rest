const express = require('express');
const router = express.Router();

let Review = require('../../models/review.model');

router.get('/:location',(req,res) => {
    const location = req.params.location

    Review.find({name: location})
    .then(result => {
        if(result) {
            res.json({
              status: true,
              message: 'Reviews found!',
              reviews: result  
            })
        } else {
            res.json({
                status: false,
                message: 'No such location found'
            })
        }
    })
    .catch(err => console.log(err));
});

module.exports = router;