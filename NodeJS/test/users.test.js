const request = require("supertest");
const app = require("../src/app");
const Course = require("../src/mongoose/models/courses");
const {
  setUpDatabase,
  courseOne,
  courseThree,
  courseTwo,
  courseFour,
  courseFive,
} = require("./utils/testDB");

beforeEach(setUpDatabase);

//user getting all the courses
test("Viewing all the courses", async () => {
  const response = await request(app).get("/courses/get").expect(200);
  expect(response.body.length).toBe(5);
  expect(response.body[0].courseName).toBe(courseOne.courseName);
  expect(response.body[1].courseName).toBe(courseTwo.courseName);
  expect(response.body[2].courseName).toBe(courseThree.courseName);
  expect(response.body[3].courseName).toBe(courseFour.courseName);
  expect(response.body[4].courseName).toBe(courseFive.courseName);
});

//user enrolling for a course
test("Enrolling a course", async () => {
  await request(app).post(`/courses/enroll/${courseThree._id}`).expect(200);
  const course = await Course.findById(courseThree._id);
  expect(course.isApplied).toBe(true);
});

//user enrolling for an already enrolled course
test("Enrolling an already enrolled course", async () => {
  await request(app).post(`/courses/enroll/${courseOne._id}`).expect(403);
  const course = await Course.findById(courseOne._id);
  expect(course.isApplied).toBe(true);
});

//user dropping a course
test("Dropping a course", async () => {
  await request(app).delete(`/courses/drop/${courseTwo._id}`).expect(200);
  const course = await Course.findById(courseTwo._id);
  expect(course.isApplied).toBe(false);
});

//user dropping an unenrolled course
test("Dropping an unenrolled course", async () => {
  await request(app).delete(`/courses/drop/${courseThree._id}`).expect(403);
  const course = await Course.findById(courseThree._id);
  expect(course.isApplied).toBe(false);
});

//user giving rating for a course
test("Rating a course", async () => {
  await request(app).patch(`/courses/rating/${courseFour._id}`).send({
    rating: 5,
  });
  const course = await Course.findById(courseFour._id);
  expect(course.rating).toBe(4.3);
  expect(course.noOfRatings).toBe(courseFour.noOfRatings + 1);
});

//user giving rating to an already rated course
test("Rating an already rated course", async () => {
  await request(app)
    .patch(`/courses/rating/${courseOne._id}`)
    .send({
      rating: 5,
    })
    .expect(403);
});

//user giving rating to a course he has not enrolled
test("Giving rating to an unenrolled course", async () => {
  await request(app)
    .patch(`/courses/rating/${courseFive._id}`)
    .send({
      rating: 5,
    })
    .expect(403);
});
