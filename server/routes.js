const sql = require("./db.js");

module.exports = app => {
  // Get roll result
  app.get("/roll/:sides/:roll_cnt", (req, res) => {
    let rolls = []
    for(let i = 0; i < req.params.roll_cnt; i++)
    {
      const roll = Math.floor( Math.random() * req.params.sides ) + 1
      rolls.push( roll );
    }
    res.json({ rolls });
  });
  
  // Sign up user
  app.get("/signup/:username/:password", (req, res) => {
    sql.query("INSERT INTO users (username, password) VALUES (?, ?)", [req.params.username, req.params.password], (err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      }
      console.log(result);
      res.json({user_id: result["insertId"] })
    });
  });
  
  // Login user
  app.get("/login/:username/:password", (req, res) => {
    sql.query("SELECT * FROM users where username=? AND password=?", [req.params.username, req.params.password], (err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      }
      console.log(result);
      res.json({ user_id: result.user_id })
    });
  });
  
  // Get all highscores sorted DESC
  app.get("/highscores/", (req, res) => {
    sql.query("SELECT users.username, scores.score FROM users \
               INNER JOIN scores ON users.user_id=scores.user_id \
               order by scores.score DESC", (err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      }
      console.log(result);
      res.json({ result })
    });
  });

  // Get today's highscores sorted DESC
  app.get("/highscores/today", (req, res) => {
    var today_start = new Date();
    today_start.setHours(0,0,0,0);
    var today_end = new Date();
    today_end.setHours(24,0,0,0);
    let today_start_sql = today_start.toJSON().slice(0, 19).replace('T', ' ');
    let today_end_sql   = today_end.toJSON().slice(0, 19).replace('T', ' ');

    sql.query("SELECT users.username, scores.score FROM users \
               INNER JOIN scores ON users.user_id=scores.user_id \
               WHERE scores.date < ? and scores.date > ? \
               order by scores.score DESC", [today_end_sql, today_start_sql], (err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      }
      console.log(result);
      res.json({ result })
    });
  });
  
  // Get specific user's highscore
  app.get("/highscores/:user_id/", (req, res) => {
    sql.query("SELECT users.username, scores.score FROM users \
               INNER JOIN scores ON users.user_id=scores.user_id \
               WHERE users.user_id=?", [req.params.user_id], (err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      }
      console.log(result);
      res.json({ result })
    });
  });

  // Set specific user's highscore
  app.get("/set_highscores/:user_id/:score", (req, res) => {
    const datetime = new Date().toJSON().slice(0, 19).replace('T', ' ')
    sql.query("REPLACE INTO scores (user_id, score, date) VALUES(?,?,?)", 
              [req.params.user_id, req.params.score, datetime], (err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      }
      console.log(result);
      res.json({ result })
    });
  });
};