// Loading modules
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

//Sets up the express app
const app = express();
const PORT = process.env.PORT || 3000;


app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Make express serve static files relative to the public directory
app.use(express.static("public"));

//the mongoose.connect() command will attempt to use the environment variable first. If it's running on Heroku, it will find that variable and use it. If it's running locally on your machine, it won't find that variable and will fall back to use your local database connection instead.
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// routes
app.use(require("./routes/api.js"));

//console message
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});