const mongoose = require("mongoose");

//connection to database
mongoose.connect("mongodb://127.0.0.1:27017/learning-app-easy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
