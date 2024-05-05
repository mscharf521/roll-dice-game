const express = require("express");
const cors = require("cors");

const serverless = require("serverless-http");
const sql = require("./db.js");

const app = express();

var corsOptions = {
  origin: "*",
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

const httpHandler = serverless(app);
module.exports.handler = async (context, req) => {
  const result = await httpHandler(context, req);
  await sql.end();
  return result;
};

// set port, listen for requests
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });
