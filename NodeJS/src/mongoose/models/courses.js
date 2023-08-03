const mongoose = require("mongoose");

//setting up schema for courses
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    validate(value) {
      if (!value.match(/^[A-Za-z0-9. ]{3,}$/)) {
        throw new Error(
          "Course name can contain only alphabets, numbers, spaces and dots. The length of the course name should be greater than 2 letters"
        );
      }
    },
  },
  courseDept: {
    type: String,
    required: true,
    validate(value) {
      if (!value.match(/^(WD|AI|DS|CS|CC|UI|GD)$/)) {
        throw new Error("Please enter a valid department name");
      }
    },
  },
  description: {
    type: String,
    required: true,
    validate(value) {
      if (!value.match(/(?:[^!@#$%]+ ){2,14}[^!@#$%]+/)) {
        throw new Error(
          "Course description should have a length of atleast 3 words"
        );
      }
    },
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  isRated: {
    type: Boolean,
    default: false,
  },
  isApplied: {
    type: Boolean,
    default: false,
  },
  noOfRatings: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0.0,
  },
});

//setting up foreign key
courseSchema.virtual("courseId", {
  ref: "AppliedCourses",
  localField: "_id",
  foreignField: "courseID",
});

//setting up the Course model
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
