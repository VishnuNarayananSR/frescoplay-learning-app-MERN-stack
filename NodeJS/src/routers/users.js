const express = require("express");
const Course = require("../mongoose/models/courses");

//setting up the student router
const usersRouter = express.Router();

//write your code here

usersRouter.post('/courses/enroll/:id', async (req, res, next) => {
    const id = req.params.id;
    const course = await Course.findById(id);
    try {
        if (course.isApplied) {
            return res.status(403).send({
                "message": "You have already applied for this course"
            })
        }
        course.isApplied = true;
        await course.save();
        return res.send({
            "message": "You have successfully enrolled for the course"
        });
    } catch (err) {
        res.sendStatus(400)
    }
})


usersRouter.delete('/courses/drop/:id', async (req, res, next) => {
    const id = req.params.id;
    const course = await Course.findById(id);
    try {
        if (!course.isApplied) {
            return res.status(403).send({
                "error": "You have not enrolled for this course"
            })
        }
        course.isApplied = false;
        await course.save();
        return res.send({
            "message": "You have dropped the course"
        });
    } catch (err) {
        res.sendStatus(400)
    }
})

usersRouter.get('/courses/get', async (req, res, next) => {
    const courses = await Course.find();
    return res.send(courses);

})

usersRouter.patch('/courses/rating/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const course = await Course.findById(id);
        const { isApplied, isRated, noOfRatings, rating } = course
        if (!isApplied) {
            return res.status(403).send({
                "error": "You have not enrolled for this course"
            })
        }
        if (isRated) {
            return res.status(403).send({
                "error": "You have already rated this course"
            })
        }
        const newRating = req.body.rating;
        if (!newRating) {
            return res.sendStatus(400);
        }
        const resNoOfRatings = noOfRatings + 1;
        const resRating = (((rating || 0) * noOfRatings + newRating) / resNoOfRatings).toFixed(1);
        course.rating = resRating;
        course.noOfRatings = resNoOfRatings;
        course.isRated = true;
        await course.save();
        res.send({
            "message": "You have rated this course"
        })
    }
    catch {
        res.sendStatus(400);
    }

})
module.exports = usersRouter;
