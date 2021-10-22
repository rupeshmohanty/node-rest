const express = require('express');
const router = express.Router();

let Review = require('../../models/review.model');

router.get('/:location',(req,res) => {
    const location = req.params.location

    Review.find({name: location}, (err,review) => {
        if(err) {
            console.log(err);
        }
        res.json({
            status: true,
            message: 'Reviews found!',
            reviews: review
        })
    })
}); 

module.exports = router;