const express = require("express");
const cors    = require("cors");

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// set up routes
app.get("/", (req, res) => {
  res.json({ message: "This is the roll-dice-game-backend." });
});

require("./routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Keep backend awake
/*
var https = require("https");
setInterval(function() {
    https.get("https://roll-dice-game-backend.herokuapp.com/");
}, 300000); // every 5 minutes (300000)
*/