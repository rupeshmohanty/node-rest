const express = require('express');
const router = express.Router();
const multer = require('multer');

// model import!
let Review = require('../../models/review.model');

const storage = multer.memoryStorage()

//upload image config
const avatar = multer({
    limits: {
        fileSize: 2000000  //2MB default is 1Mb
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|webp|JPG|PNG|JPEG|WEBP)$/))
        return cb(new Error('File format is incorrect'));
        cb(undefined, true); //if there is no error
    },
    storage: storage 
})

// post a review
router.post('/post-review',avatar.single('image'), (req,res) => {
    const { userId, name, brief, description, rating } = req.body;
    if(!userId || !name || !brief || !description || !rating || !req.file) {
        res.json({
            status: false,
            message: 'Please fill all the details!'
        })
    }
    else{
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
                review.image = req.file.buffer
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
    }
},(err, req, res, next) => res.status(404).json({
    status: false,
    message: err.message
}))

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
router.put('/:id',avatar.single('image'),(req,res) => {
    if(req.file){
        req.body.image = req.file.buffer;
    }
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