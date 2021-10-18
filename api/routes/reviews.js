const express = require('express');
const router = express.Router();

// model import!
let Review = require('../../models/review.model');

// post a review
router.post('/post-review',(req,res) => {
    const { userId, name, brief, description, rating } = req.body;

    if(!userId || !name || !brief || !description || !rating) {
        res.json({
            status: false,
            message: 'Please fill all the details!'
        })
    }

    Review.findOne({ name: name })
    .then(review => {
        if(review) {
            res.json({
                status: false,
                message: 'Review already exists!'
            })
        } else {
            const review = new Review({
                userId,
                name,
                brief,
                description,
                rating
            })

            review.save()
            .then(() => {
                res.json({
                    status: true,
                    message: 'Posted review!'
                })
            })
            .catch(err => console.log(err))
        }
    })
    .catch(err => console.log(err));
})

// fetch all reviews for the user!
router.get('/:id',(req,res) => {
    const userId = req.params.id;

    Review.find({ userId: userId })
    .then(reviews => {
        res.json({
            status: true,
            message: 'All reviews fetched',
            reviews: reviews
        })
    })
    .catch(err => console.log(err));
})

// update the review!
router.put('/:id',(req,res) => {
    Review.findOneAndUpdate({
        _id: req.params.id
    },req.body)
    .then(() => {
        Review.findOne({_id: req.params.id})
        .then(review => {
            res.json({
                status: true,
                message: 'Review updated successfully',
                review: review
            })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// delete a review!
router.delete('/:id',(req,res) => {
    Review.findOneAndDelete({ _id: req.params.id })
    .then(() => {
        res.json({
            status: true,
            message: 'Review deleted'
        })
    })
    .catch(err => console.log(err));
})

module.exports = router;