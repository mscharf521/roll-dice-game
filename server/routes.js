const sql = require("./db.js");

module.exports = (app) => {
  // Get roll result
  app.post("/roll/:sides/:roll_cnt/:user_id", (req, res) => {
    let rolls = [];
    for (let i = 0; i < req.params.roll_cnt; i++) {
      const roll = Math.floor(Math.random() * req.params.sides) + 1;
      rolls.push(roll);
    }
    const sum = rolls.reduce((partialSum, a) => partialSum + a, 0);

    // Check if this is a new highscore for the user
    var highscore = false;
    var day_highscore = false;
    sql.query(
      "SELECT * FROM scores where user_id=?",
      [req.params.user_id],
      (err, result) => {
        if (!err) {
          const datetime = new Date().toJSON().slice(0, 19).replace("T", " ");
          var today_start = new Date();
          today_start.setHours(0, 0, 0, 0);
          let today_start_norm = today_start
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");

          if (
            typeof result === "undefined" ||
            result.length === 0 ||
            sum > result[0].score
          ) {
            // This is a new highscore for the player all time
            highscore = true;
            day_highscore = true;
            sql.query(
              "REPLACE INTO scores (user_id, score, day_score_date, day_score) VALUES(?,?,?,?)",
              [req.params.user_id, sum, datetime, sum],
              (err, result) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          } else {
            let day_score_norm = result[0].day_score_date;
            if (
              sum > result[0].day_score || // score is better than day score OR
              day_score_norm < today_start_norm // new day so replace old day score
            ) {
              // This is a new highscore for the player on this day
              day_highscore = true;
              sql.query(
                "REPLACE INTO scores (user_id, score, day_score_date, day_score) VALUES(?,?,?,?)",
                [req.params.user_id, result[0].score, datetime, sum],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            }
          }
        }

        res.json({ rolls, sum, highscore, day_highscore });
      }
    );
  });

  // Sign up user
  app.post("/signup/:username/:password", (req, res) => {
    sql.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [req.params.username, req.params.password],
      (err, result) => {
        if (err) {
          if (err.code == "ER_DUP_ENTRY") {
            res.status(400);
            res.json({ err_msg: "Username is taken" });
          } else {
            res.status(500);
            res.json({ err_msg: "Server Error" });
          }
        } else {
          res.json({ user_id: result["insertId"] });
        }
      }
    );
  });

  // Login user
  app.get("/login/:username/:password", (req, res) => {
    sql.query(
      "SELECT * FROM users where username=? AND password=?",
      [req.params.username, req.params.password],
      (err, result) => {
        if (err) {
          res.status(500);
          res.json({ err_msg: "Server Error" });
        } else {
          if (result.length > 0) {
            res.json({ user_id: result[0].user_id });
          } else {
            res.status(400);
            res.json({ err_msg: "Invalid Login" });
          }
        }
      }
    );
  });

  // Get user data
  app.get("/user/:user_id", (req, res) => {
    sql.query(
      "SELECT * FROM users where user_id=? ",
      [req.params.user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500);
          res.json({ err_msg: "Server Error" });
        } else if (typeof result !== "undefined" && result.length > 0) {
          res.json({
            user_id: result[0].user_id,
            username: result[0].username,
          });
        }
      }
    );
  });

  // Get all highscores sorted DESC
  app.get("/highscores/", (req, res) => {
    sql.query(
      "SELECT users.username, scores.score FROM users \
               INNER JOIN scores ON users.user_id=scores.user_id \
               order by scores.score DESC",
      (err, result) => {
        if (!err) {
          res.json(result);
        } else {
          console.log(err);
        }
      }
    );
  });

  // Get today's highscores sorted DESC
  app.get("/highscores/today", (req, res) => {
    var today_start = new Date();
    today_start.setHours(0, 0, 0, 0);
    let today_start_sql = today_start.toJSON().slice(0, 19).replace("T", " ");
    sql.query(
      "SELECT users.username, scores.day_score FROM users \
               INNER JOIN scores ON users.user_id=scores.user_id \
               WHERE scores.day_score_date > ? \
               ORDER BY scores.day_score DESC",
      [today_start_sql],
      (err, result) => {
        if (!err) {
          res.json(result);
        } else {
          console.log(err);
        }
      }
    );
  });

  // Get specific user's highscore
  app.get("/highscore/:user_id", (req, res) => {
    sql.query(
      "SELECT users.username, scores.score FROM users \
               INNER JOIN scores ON users.user_id=scores.user_id \
               WHERE users.user_id=?",
      [req.params.user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        if (typeof result !== "undefined" && result.length > 0) {
          res.json(result[0]);
        }
      }
    );
  });

  // Get specific user's highscore today
  app.get("/highscore/today/:user_id", (req, res) => {
    var today_start = new Date();
    today_start.setHours(0, 0, 0, 0);
    let today_start_sql = today_start.toJSON().slice(0, 19).replace("T", " ");
    sql.query(
      "SELECT users.username, scores.day_score, scores.day_score_date FROM users \
               INNER JOIN scores ON users.user_id=scores.user_id \
               WHERE users.user_id=? AND scores.day_score_date > ?",
      [req.params.user_id, today_start_sql],
      (err, result) => {
        console.log("🚀 ~ /highscore/today ~ result:", result);
        if (!err) {
          var day_score = 0;
          if (typeof result !== "undefined" && result.length > 0) {
            day_score = result[0].day_score;
          }
          res.json({ day_score });
        } else {
          console.log(err);
        }
      }
    );
  });
};
